"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_IDS_QUERY } from "@/sanity/lib/queries";

export const createPitch = async (
  prevState: any,
  formData: FormData,
  pitch: string
) => {
  // 1. Verify the user is authenticated before allowing writes to the database
  const session = await auth();

  if (!session) {
    return {
      ...prevState,
      status: "ERROR",
      error: "You must be signed in to submit a startup.",
    };
  }

  // 2. Extract the physical file and text data from the FormData object
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const file = formData.get("file") as File;

  try {
    // 3. Upload the raw file to Sanity's Asset CDN first
    const imageAsset = await writeClient.assets.upload("image", file, {
      filename: file.name,
    });

    // 4. Construct the startup document
    const startup = {
      _type: "startup",
      title,
      description,
      category,
      
      // Generate a URL-friendly slug from the title (e.g., "My Startup" -> "my-startup")
      slug: {
        _type: "slug",
        current: title.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
      },
      
      // Associate the authenticated user as the author
      author: {
        _type: "reference",
        _ref: session?.id, 
      },
      
      pitch,
      
      // Link the uploaded file to this startup document
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      },
    };

    // 5. Write the final document to the database
    const result = await writeClient.create(startup);

    return {
      ...prevState,
      status: "SUCCESS",
      error: "",
      _id: result._id,
    };
  } catch (error) {
    console.error("Failed to create pitch:", error);

    return {
      ...prevState,
      status: "ERROR",
      error: "An unexpected error occurred while creating the startup.",
    };
  }
};

export const editPitch = async (
  prevState: any,
  formData: FormData,
  pitch: string,
  startupId: string // We need the ID of the document to patch
) => {
  const session = await auth();

  if (!session) {
    return { ...prevState, status: "ERROR", error: "Not signed in" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const file = formData.get("file") as File | null;

  try {
    // 1. Prepare the standard text updates
    const updateData: any = {
      title,
      description,
      category,
      pitch,
    };

    // 2. Only upload and patch a new image if the user actually selected one
    if (file && file.size > 0) {
      const imageAsset = await writeClient.assets.upload("image", file, {
        filename: file.name,
      });
      
      // Add the new image reference to our update payload
      updateData.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      };
    }

    // 3. Patch the existing document in the database
    const result = await writeClient
      .patch(startupId)
      .set(updateData)
      .commit();

    return {
      ...prevState,
      status: "SUCCESS",
      error: "",
      _id: result._id,
    };
  } catch (error) {
    console.error("Failed to update pitch:", error);
    return {
      ...prevState,
      status: "ERROR",
      error: "An unexpected error occurred while updating the startup.",
    };
  }
};

export const getRecentStartupsData = async (ids: string[]) => {
  try {
    // Fetch the data using the exact query from your queries.ts file
    const startups = await client.fetch(STARTUPS_BY_IDS_QUERY, { ids });
    
    return startups;
  } catch (error) {
    console.error("Failed to fetch recent startups:", error);
    
    // Return an empty array so the UI fails gracefully and doesn't crash the carousel
    return []; 
  }
};