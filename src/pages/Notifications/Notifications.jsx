import { CheckCheck } from "lucide-react";
import AppNavbar from "../../component/AppNavbar/AppNavbar";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet } from "react-router";
import { useState } from "react";
import AllNotifications from "../AllNotifications/AllNotifications";
import UnreadNotifications from "../UnreadNotifications/UnreadNotifications";
import MarkAllAsRead from "../../component/MarkAllAsRead/MarkAllAsRead";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");

  async function CountUnreaded() {
    const unreadedCounter = await axiosInterceptors.get(
      `notifications/unread-count`,
    );
    return unreadedCounter?.data?.data?.unreadCount;
  }
  const { data: unreadedCounter } = useQuery({
    queryKey: ["Notifications", "count", "Posts"],
    queryFn: CountUnreaded,
  });
  const tabsContent = {
    all: <AllNotifications />,
    unread: <UnreadNotifications />,
  };
  return (
    <>
      <AppNavbar />
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                    Notifications
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Realtime updates for likes, comments, shares, and follows.
                  </p>
                </div>
                <MarkAllAsRead />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    activeTab === "all" ?
                      "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}>
                  All
                </button>

                {/* زرار الـ Unread */}
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    activeTab === "unread" ?
                      "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}>
                  Unread
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === "unread" ?
                        "bg-white text-[#1877f2]"
                      : "bg-white text-[#1877f2]" // تقدر تغير ألوان الرقم لو التاب مش نشط
                    }`}>
                    {unreadedCounter || 0}
                  </span>
                </button>
              </div>
            </div>
            <div className="space-y-2 p-3 sm:p-4">{tabsContent[activeTab]}</div>
          </section>
        </main>
      </div>
    </>
  );
}
