"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { STARTUPS_BY_IDS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";


// This runs securely on the server, fetching the full objects for our cards
export async function getRecentStartupsData(ids: string[]) {
  const data = await client.fetch(STARTUPS_BY_IDS_QUERY, { ids });
  return data;
}

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string,
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const category = form.get("category") as string;
  const link = form.get("link") as string;

  const slug = slugify(title, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
      views: 0, 
    };

    const result = await writeClient.create({ _type: "startup", ...startup });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};