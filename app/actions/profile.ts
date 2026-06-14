"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { revalidateTag } from "next/cache"; 
import { profileSchema } from "@/lib/validation"; 

export async function updateProfile(formData: FormData) {
  // 1. Session Authorization
  const session = await auth();
  if (!session?.id) {
    throw new Error("Unauthorized");
  }

  // 2. Extract Raw Data
  const rawData = {
    name: formData.get("name"),
    bio: formData.get("bio"),
    avatar: formData.get("avatar"),
  };

  // 3. Bulletproof Validation via Zod
  const validatedFields = profileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { 
      success: false, 
      error: validatedFields.error.errors[0].message 
    };
  }

  // 4. Destructure the safely typed and validated data
  const { name, bio, avatar } = validatedFields.data;

  try {
    let finalImageUrl = undefined;

    // 5. Process the verified file
    if (avatar && avatar.size > 0) {
      const buffer = Buffer.from(await avatar.arrayBuffer());
      
      const uploadedAsset = await writeClient.assets.upload('image', buffer, {
        filename: avatar.name,
      });
      
      finalImageUrl = uploadedAsset.url;
    }

    // 6. Build the mutation patch
    const patchData: any = {
      name: name.trim(),
      bio: bio ? bio.trim() : "",
    };

    if (finalImageUrl) {
      patchData.image = finalImageUrl;
    }

    // 7. Execute the database update
    await writeClient
      .patch(session.id)
      .set(patchData)
      .commit();

    // 8. Update user's cached data
    // @ts-expect-error - Next.js local type definition mismatch; runtime expects 1 argument.
    revalidateTag(`user-profile-${session.id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "An internal error occurred while saving." };
  }
}