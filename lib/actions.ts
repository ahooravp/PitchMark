"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_IDS_QUERY } from "@/sanity/lib/queries";

export type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
  _id?: string;
};

// 1. THE NEW DEDICATED UPLOAD ACTION
export const uploadStartupImage = async (formData: FormData) => {
  const session = await auth();

  // Strict security: Do not allow unauthenticated users to upload files
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided" };
  }

  try {
    const imageAsset = await writeClient.assets.upload("image", file, {
      filename: file.name,
    });

    return { success: true, assetId: imageAsset._id };
  } catch (error) {
    console.error("Asset upload failed:", error);
    return { success: false, error: "Failed to upload image to the server." };
  }
};

export const createPitch = async (
  prevState: FormState,
  formData: FormData,
  pitch: string
): Promise<FormState> => {
  const session = await auth();

  if (!session) {
    return {
      ...prevState,
      status: "ERROR",
      error: "You must be signed in to submit a startup.",
    };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const assetId = formData.get("assetId") as string;

  // 2. Strict validation: Ensure the background upload completed
  if (!assetId) {
    return {
      ...prevState,
      status: "ERROR",
      error: "An uploaded image is required to create a startup.",
    };
  }

  try {
    const startup = {
      _type: "startup",
      title,
      description,
      category,
      slug: {
        _type: "slug",
        current: title.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
      },
      author: {
        _type: "reference",
        _ref: session?.user?.id,
      },
      pitch,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: assetId,
        },
      },
    };

    const result = await writeClient.create(startup);

    return {
      ...prevState,
      status: "SUCCESS",
      error: "",
      _id: result._id,
    };
  } catch (error: unknown) {
    console.error("Failed to create pitch:", error);
    return {
      ...prevState,
      status: "ERROR",
      error: "An unexpected error occurred while creating the startup.",
    };
  }
};

export const editPitch = async (
  prevState: FormState,
  formData: FormData,
  pitch: string,
  startupId: string
): Promise<FormState> => {
  const session = await auth();

  if (!session) {
    return { ...prevState, status: "ERROR", error: "Not signed in" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const assetId = formData.get("assetId") as string; // Will be empty if no new file was uploaded

  try {
    const updateData: Record<string, unknown> = {
      title,
      description,
      category,
      pitch,
    };

    // 3. Only patch the image if a brand new assetId was provided
    if (assetId) {
      updateData.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: assetId,
        },
      };
    }

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
  } catch (error: unknown) {
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
    const startups = await client.fetch(STARTUPS_BY_IDS_QUERY, { ids });
    return startups;
  } catch (error: unknown) {
    console.error("Failed to fetch recent startups:", error);
    return [];
  }
};