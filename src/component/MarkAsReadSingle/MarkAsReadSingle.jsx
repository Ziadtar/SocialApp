import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";

export default function MarkAsReadSingle({ NotificationID }) {
  const QueryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await axiosInterceptors.patch(
        `notifications/${NotificationID}/read`,
      );
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["Notifications"] });
    },
  });
  return (
    <>
      <button
        onClick={() => mutate()}
        className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#1877f2] ring-1 ring-[#dbeafe] transition hover:bg-[#e7f3ff] cursor-pointer">
        <Check />
        {isPending ? "Loading..." : " Mark as read"}
      </button>
    </>
  );
}
