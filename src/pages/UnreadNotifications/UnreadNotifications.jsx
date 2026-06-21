import { useQuery } from "@tanstack/react-query";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import NotificationsCard from "../../component/NotificationsCard/NotificationsCard";

export default function UnreadNotifications() {
  async function getUnreadNotification() {
    const res = await axiosInterceptors.get(
      `notifications?unread=false&page=1&limit=30`,
    );
    return res?.data?.data?.notifications;
  }
  const { data } = useQuery({
    queryKey: ["Notifications", "Posts"],
    queryFn: getUnreadNotification,
  });
  return (
    <>
      {data?.map((e) => (
        <NotificationsCard key={e._id} userNotification={e} />
      ))}
      {data >= 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm font-semibold text-slate-500">
            No notifications yet.
          </p>
        </div>
      )}
    </>
  );
}
