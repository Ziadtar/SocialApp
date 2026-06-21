import { useContext, useRef, useState } from "react";
import AppNavbar from "../../component/AppNavbar/AppNavbar";
import { Bookmark, Camera, Expand, FileText, Mail, Users } from "lucide-react";
import { AuthContext } from "../../component/context/AuthContextProvider/AuthContextProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet } from "react-router";

export default function Profile() {
  const { userData, getUserData } = useContext(AuthContext);
  const [switchTab, setSwitchTab] = useState("myPosts");
  const {
    bookmarksCount,
    name,
    photo,
    username,
    followersCount,
    followingCount,
    email,
    id,
  } = userData || {};
  const profileImage = useRef();
  async function updataProfileImage() {
    const imageData = new FormData();
    imageData.append("photo", profileImage.current.files[0]);
    toast.promise(
      axios.put(
        `${import.meta.env.VITE_BASE_URL}users/upload-photo`,
        imageData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      ),
      {
        loading: "update Profile Image....",
        success: function ({ data: { message } }) {
          getUserData();
          return message;
        },
        error: function (error) {
          console.log(error);
          return error.response.data.data.error;
        },
      },
    );
  }
  async function getUserPosts() {
    const allPosts = await axiosInterceptors.get(`users/${id}/posts`);
    return allPosts.data?.data?.posts;
  }
  const { data } = useQuery({
    queryKey: ["ProfilePosts", id],
    queryFn: getUserPosts,
  });
  async function getUserPostsBookmarks() {
    const allPosts = await axiosInterceptors.get(`users/bookmarks`);
    return allPosts.data?.data?.bookmarks;
  }
  const { data: bookmarksData } = useQuery({
    queryKey: ["ProfilePosts", "bookmarks"],
    queryFn: getUserPostsBookmarks,
  });
  return (
    <>
      <AppNavbar />
      <div className=" h-screen w-screen">
        <div className="container mx-auto  h-screen p-5 min-w-0">
          <div className=" h-screen ">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
              <div className="group/cover relative h-44 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60">
                <div className="pointer-events-none absolute right-2 top-2 z-10 flex max-w-[90%] flex-wrap items-center justify-end gap-1.5 opacity-100 transition duration-200 sm:right-3 sm:top-3 sm:max-w-none sm:gap-2 sm:opacity-0 sm:group-hover/cover:opacity-100 sm:group-focus-within/cover:opacity-100">
                  <label className="pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs z-40">
                    <Camera size={14} />
                    Add cover
                    <input type="file" accept="image/" className="hidden" />
                  </label>
                </div>
              </div>
              <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
                <div className="rounded-3xl border border-white/60 bg-white/92 p-5  backdrop-blur-xl sm:p-7">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-end gap-4">
                        <div className="group/avatar relative shrink-0">
                          <button
                            type="button"
                            className="cursor-pointer rounded-full">
                            <img
                              src={photo}
                              alt={name}
                              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                            />
                          </button>
                          <button
                            type="button"
                            title="View profile photo"
                            aria-label="View profile photo"
                            className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#1877f2] opacity-100 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:bg-slate-50 sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100">
                            <Expand size={14} />
                          </button>
                          <label
                            onClick={() => {
                              profileImage.current.click();
                            }}
                            className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white opacity-100 shadow-sm transition duration-200 hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100">
                            <Camera size={14} />
                          </label>
                        </div>
                        <div className="min-w-0 pb-1">
                          <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                            {name}
                          </h2>
                          <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                            @{username}
                          </p>
                          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                            <Users size={14} />
                            Route Posts member
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid w-full grid-cols-3 gap-2 lg:w-130">
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                          Followers
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                          {followersCount}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                          Following
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                          {followingCount}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                          Bookmarks
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                          {bookmarksCount}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <h3 className="text-sm font-extrabold text-slate-800">
                        About
                      </h3>
                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <Mail size={14} />
                          {email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users size={14} />
                          Active on Route Posts
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                          My posts
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900">
                          {data?.length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                          Saved posts
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900">
                          {bookmarksData?.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
                  <Link
                    to="profileMyPosts"
                    onClick={() => setSwitchTab("myPosts")}
                    className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${switchTab === "myPosts" ? "bg-[#e7f3ff] text-[#1877f2]" : "text-slate-600 hover:text-slate-900"}`}>
                    <FileText size={14} />
                    My Posts
                  </Link>
                  <Link
                    to="profileSaved"
                    onClick={() => setSwitchTab("savedPosts")}
                    className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${switchTab === "savedPosts" ? "bg-[#e7f3ff] text-[#1877f2]" : "text-slate-600 hover:text-slate-900"}`}>
                    <Bookmark size={14} />
                    Saved
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                <Outlet />
                {/* <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  You have not posted yet.
                </p> */}
              </div>
            </section>
          </div>
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        ref={profileImage}
        accept="image/"
        onChange={updataProfileImage}
      />
    </>
  );
}
