"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_IDS_QUERY } from "@/sanity/lib/queries";

// 1. Define the strict contract for your form state
export type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
  _id?: string;
};

export const createPitch = async (
  prevState: FormState, 
  formData: FormData,
  pitch: string
): Promise<FormState> => { // <-- Force the return type to guarantee consistency
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
  const file = formData.get("file") as File;

  try {
    const imageAsset = await writeClient.assets.upload("image", file, {
      filename: file.name,
    });

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
        _ref: session?.id, 
      },
      pitch,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
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
  } catch (error: unknown) { // <-- Safely type the error
    console.error("Failed to create pitch:", error);

    return {
      ...prevState,
      status: "ERROR",
      error: "An unexpected error occurred while creating the startup.",
    };
  }
};

export const editPitch = async (
  prevState: FormState, // <-- Replaced 'any'
  formData: FormData,
  pitch: string,
  startupId: string 
): Promise<FormState> => { // <-- Force the return type
  const session = await auth();

  if (!session) {
    return { ...prevState, status: "ERROR", error: "Not signed in" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const file = formData.get("file") as File | null;

  try {
    // 2. Use a safe Record type instead of 'any'
    // This tells TS: "This is an object with string keys and safely unknown values"
    const updateData: Record<string, unknown> = {
      title,
      description,
      category,
      pitch,
    };

    if (file && file.size > 0) {
      const imageAsset = await writeClient.assets.upload("image", file, {
        filename: file.name,
      });
      
      updateData.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
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
  } catch (error: unknown) { // <-- Safely type the error
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
  } catch (error: unknown) { // <-- Safely type the error
    console.error("Failed to fetch recent startups:", error);
    return []; 
  }
};