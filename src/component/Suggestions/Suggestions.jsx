import SuggestionsCard from "../SuggestionsCard/SuggestionsCard";
import { Search } from "lucide-react";
import { Input, Spinner } from "@heroui/react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";

export default function Suggestions() {
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchSuggestedFriends() {
    const response = await axiosInterceptors.get(
      `users/suggestions?limit=5&q=${searchQuery}`,
    );
    return response.data?.data?.suggestions || [];
  }

  const { data, isLoading } = useQuery({
    queryFn: fetchSuggestedFriends,
    queryKey: ["suggestedFriends", searchQuery],
  });

  return (
    <>
      <aside className="hidden h-fit xl:sticky xl:top-2.5 xl:block">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">
                Suggested Friends
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
              {data?.length}
            </span>
          </div>

          <div className="mb-3">
            <label
              className="relative block w-full"
              htmlFor="suggested-friends">
              <Input
                fullWidth
                startContent={<Search size={14} />}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white"
                classNames={{
                  base: "!p-0 !m-0 !w-full !max-w-none !bg-transparent",
                }}
              />
            </label>
          </div>

          <div className="space-y-3">
            {isLoading ?
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
              </div>
            : data?.length > 0 ?
              data.map((suggestion) => (
                <SuggestionsCard
                  key={suggestion._id}
                  userSuggestions={suggestion}
                />
              ))
            : <p className="text-center text-sm text-slate-500 py-2">
                No friends found.
              </p>
            }
          </div>

          <Link
            to={"/AllSuggestedFriends"}
            className="cursor-pointer mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
            View more
          </Link>
        </div>
      </aside>
    </>
  );
}
