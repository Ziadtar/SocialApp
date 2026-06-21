import axios from "axios";
import { AuthContext } from "../../component/context/AuthContextProvider/AuthContextProvider";
import { useContext } from "react";
import PostCard from "../../component/postCard/PostCard";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";

export default function MyPosts() {
  const { userData } = useContext(AuthContext);
  const id = userData?.id;

  const fetchMyPosts = async () => {
    if (!id) return [];
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}users/${id}/posts`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
    return data?.data?.posts || data?.data || [];
  };

  const {
    data: myPosts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["Posts", "profile", id],
    queryFn: fetchMyPosts,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading ?
        <div className="shadow-panel space-y-5 rounded-lg bg-transparent p-4">
          <Skeleton className="h-32 rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
            <Skeleton className="h-3 w-2/5 rounded-lg" />
          </div>
        </div>
      : myPosts?.length > 0 ?
        myPosts.map((post) => <PostCard key={post._id} userPost={post} />)
        // لو مفيش بوستات خالص
      : <p className="text-center text-slate-500">
          You haven't posted anything yet.
        </p>
      }
    </div>
  );
}
