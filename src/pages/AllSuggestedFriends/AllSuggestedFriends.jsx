import { ArrowLeft } from "iconsax-reactjs";
import AppNavbar from "../../component/AppNavbar/AppNavbar";
import { Link } from "react-router";
import { Search, UsersRound } from "lucide-react";
import { Input } from "@heroui/react";
import FullCardSuggested from "../../component/FullCardSuggested/FullCardSuggested";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function AllSuggestedFriends() {
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchSuggestedFriends({ pageParam = 1 }) {
    const response = await axiosInterceptors.get(
      `users/suggestions?page=${pageParam}&limit=20&q=${searchQuery}`,
    );
    return response.data?.data?.suggestions || [];
  }
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["suggestedFriends", "Posts", searchQuery],
      queryFn: fetchSuggestedFriends,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 20 ? allPages.length + 1 : undefined;
      },
    });

  const allFriends = data?.pages.flatMap((page) => page) || [];

  return (
    <>
      <div>
        <AppNavbar />
        <div className="mx-auto max-w-7xl px-3 py-3.5">
          <main className="min-w-0">
            <div className="mx-auto max-w-3xl space-y-4">
              <Link
                to={"/Layout/feed"}
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                <ArrowLeft size={14} /> Back to feed
              </Link>
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
                      <UsersRound size={20} color="blue" />
                      All Suggested Friends
                    </h1>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                    {allFriends.length} Users
                  </span>
                </div>
                <div className="relative mb-4 block">
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
                <div className="grid grid-cols-12 gap-3 space-y-3">
                  {allFriends?.map((friend) => (
                    <FullCardSuggested key={friend.id} friend={friend} />
                  ))}
                </div>
                <button
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60">
                  {isFetchingNextPage ?
                    "Loading more..."
                  : hasNextPage ?
                    "Load more users"
                  : "No more users"}
                </button>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
