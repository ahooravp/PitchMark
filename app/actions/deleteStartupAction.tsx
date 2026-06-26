"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";

export async function deleteStartupAction(startupId: string, authorId: string) {
  const session = await auth();

  // BULLETPROOF SECURITY: Never trust the UI. Verify authorization on the server.
  if (!session || session.user?.id !== authorId) {
    throw new Error("Unauthorized action.");
  }

  try {
    await writeClient.delete(startupId);
  } catch (error) {
    console.error("Failed to delete startup:", error);
    throw new Error("Failed to delete the startup.");
  }

  // Purge the cache so the deleted startup disappears from feeds
  revalidatePath("/");
  revalidatePath(`/user/${authorId}`);

  // Redirect must happen outside the try/catch block
}