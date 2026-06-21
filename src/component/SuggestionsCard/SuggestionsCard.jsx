import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";

export default function SuggestionsCard({ userSuggestions }) {
  const queryClient = useQueryClient();
  const { name, username, photo, followersCount, mutualFollowersCount, _id } =
    userSuggestions;
  async function handleFollowUser() {
    return await axiosInterceptors.put(`users/${_id}/follow`);
  }
  const { mutate, isPending } = useMutation({
    mutationFn: handleFollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["suggestedFriends"]);
    },
    onError: () => {
      queryClient.invalidateQueries(["suggestedFriends"]);
    },
  });
  return (
    <>
      <div className="rounded-xl border border-slate-200 p-2.5 ">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-slate-50">
            <img
              src={photo}
              alt={name} 
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 hover:underline cursor-pointer">
                {name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {username ? `@${username}` : "route user"}
              </p>
            </div>
          </button>
          <button
            onClick={() => mutate()}
            className="cursor-pointer inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-60 bg-[#e7f3ff] text-[#1877f2] hover:bg-[#d8ebff]">
            {isPending ? "Following..." : "Follow"}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-slate-500 ">
          <span className="rounded-full bg-slate-100 px-2 py-0.5">
            {followersCount} followers
          </span>
          {mutualFollowersCount > 0 && (
            <span className="rounded-full bg-blue-100 text-blue-500 px-2 py-0.5">
              {mutualFollowersCount} mutual
            </span>
          )}
        </div>
      </div>
    </>
  );
}
