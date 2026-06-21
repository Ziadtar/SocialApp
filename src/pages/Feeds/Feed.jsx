import axios from "axios";
import { useEffect, useRef } from "react";
import PostCard from "../../component/postCard/PostCard";
import { Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";

const Feeds = () => {
  const loaderRef = useRef(null);

  const fetchFeeds = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}posts/feed?only=following&limit=10&page=${pageParam}`,
      { headers: { token: localStorage.getItem("token") } },
    );
    return data.data.posts;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["Posts", "feed"],
      queryFn: fetchFeeds,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },
      staleTime: 1000 * 60 * 3,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
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
    return <p className="text-center text-danger">Failed to load feed.</p>;

  return (
    <div className="flex flex-col gap-4">
      {data.pages.map((page, index) => (
        <div key={index} className="flex flex-col gap-4 w-full">
          {page.map((post) => (
            <PostCard key={post._id} userPost={post} />
          ))}
        </div>
      ))}

      <div ref={loaderRef} className="h-20 flex justify-center items-center">
        {isFetchingNextPage ?
          <Spinner color="primary" />
        : !hasNextPage ?
          <p className="text-slate-500 text-sm italic">
            You're all caught up! ✨
          </p>
        : null}
      </div>
    </div>
  );
};

export default Feeds;
