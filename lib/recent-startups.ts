// lib/recent-startups.ts

const STORAGE_KEY = "recent_startup_ids";
const MAX_ITEMS = 10;

export const saveRecentStartupId = (id: string) => {
  if (typeof window === "undefined") return;

  const existingIds: string[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  // Remove the ID if it already exists so we can bump it to the front
  const filteredIds = existingIds.filter((existingId) => existingId !== id);

  // Add the newly visited ID to the front
  filteredIds.unshift(id);

  // Keep only the last 10
  const limitedIds = filteredIds.slice(0, MAX_ITEMS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedIds));
};