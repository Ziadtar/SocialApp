import axios from "axios";
import React, { useEffect, useRef } from "react";
import PostCard from "../../component/postCard/PostCard";
import { Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";

const Posts = () => {
  const loaderRef = useRef(null);

  const fetchPosts = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}posts?page=${pageParam}&limit=10`,
      { headers: { token: localStorage.getItem("token") } },
    );
    return data.data.posts;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["Posts" ,"AllPosts"],
      queryFn: fetchPosts, 
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending")
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );
  if (status === "error")
    return <p className="text-red-500 text-center">Error loading posts.</p>;

  return (
    <div className="flex flex-col gap-4">
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.map((post) => (
            <PostCard key={post._id} userPost={post} />
          ))}
        </React.Fragment>
      ))}

      {/* الـ Loader تحت */}
      <div ref={loaderRef} className="h-20 flex justify-center items-center">
        {isFetchingNextPage ?
          <Spinner color="primary" size="lg" />
        : !hasNextPage ?
          <p className="text-slate-500 text-sm italic">
            You've reached the end! 🎉
          </p>
        : null}
      </div>
    </div>
  );
};

export default Posts;
