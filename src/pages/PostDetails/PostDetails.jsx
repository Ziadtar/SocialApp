import { ArrowLeft } from "iconsax-reactjs";
import AppNavbar from "../../component/AppNavbar/AppNavbar";
import PostCard from "../../component/postCard/PostCard";
import axios from "axios";
import { Link, useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";

export default function PostDetails() {
  const { id } = useParams();
  async function getSingleUserPost() {
    const res = await axios({
      url: `${import.meta.env.VITE_BASE_URL}posts/${id}`,
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    return res?.data?.data?.post;
  }
  const { data, isLoading, isError } = useQuery({
    queryKey: ["Posts"],
    queryFn: getSingleUserPost,
    enabled: !!id,
  });

  return (
    <>
      <AppNavbar />
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <div className="mx-auto max-w-3xl space-y-4">
            <Link
              to={"/Layout/feed"}
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
              <ArrowLeft size={14} /> Back
            </Link>
            {isLoading ?
              <div className="shadow-panel space-y-5 rounded-lg bg-transparent p-4">
                <Skeleton className="h-32 rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-3 w-3/5 rounded-lg" />
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                  <Skeleton className="h-3 w-2/5 rounded-lg" />
                </div>
              </div>
            : isError ?
              <p className="text-center text-red-500 font-bold mt-10">
                Oops! Post not found.
              </p>
            : data ?
              <PostCard userPost={data} idPostDetails={id} />
            : null}
          </div>
        </main>
      </div>
    </>
  );
}
