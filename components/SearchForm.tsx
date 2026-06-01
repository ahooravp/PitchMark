import React from "react";
import Form from "next/form"; 
import SearchFormReset from "./SearchFormReset";
import { Search } from "lucide-react";

// 1. Create a static skeleton to show while the Promise resolves
export const SearchFormSkeleton = () => (
  <div className="search-form">
    <input className="search-input" placeholder="Search Startups" disabled />
    <div className="flex gap-2">
      <button disabled className="search-btn text-white">
        <Search className="size-5" />
      </button>
    </div>
  </div>
);

// 2. Make the component async and accept the Promise directly
const SearchForm = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
  // 3. Resolve the query right here
  const { query } = await searchParams;

  return (
    <Form action="/" scroll={false} className="search-form">
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search Startups"
      />

      <div className="flex gap-2">
        {query && <SearchFormReset />}

        <button type="submit" className="search-btn text-white">
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;