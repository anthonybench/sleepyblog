"use client";
//───────────────────────────┐
//         Imports           │
//───────────────────────────┘
// next
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
// 3rd party
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// 1st party
import { ThemeContext } from "@/app/_lib/themes";

//───────────────────────────┐
//          View             │
//───────────────────────────┘
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: any) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <ThemeContext.Consumer>
      {(selectedTheme) => (
        <div className={`relative flex flex-1 flex-shrink-0`}>
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            className={`outline-none ${selectedTheme.bg.searchBar} peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2`}
            placeholder={placeholder}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            defaultValue={searchParams.get("query")?.toString()}
          />
          <MagnifyingGlassIcon
            className={`absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 peer-focus:${selectedTheme.txt.l5} ${selectedTheme.txt.l1}`}
          />
        </div>
      )}
    </ThemeContext.Consumer>
  );
}
