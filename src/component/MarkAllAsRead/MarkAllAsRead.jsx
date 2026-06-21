import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCheck } from "lucide-react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";

export default function MarkAllAsRead() {
  const QueryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await axiosInterceptors.patch(`notifications/read-all`);
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["Notifications"] });
    },
  });
  return (
    <>
      <button
        onClick={() => mutate()}
        className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        <CheckCheck size={18} />
        {isPending ? " Loading..." : " Mark all as read"}
      </button>
    </>
  );
}
