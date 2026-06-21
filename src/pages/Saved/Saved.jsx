import { useQuery } from "@tanstack/react-query";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import PostCard from "../../component/postCard/PostCard";

export default function Saved() {
  const { data, isLoading } = useQuery({
    queryKey: ["Posts", "Saved"],
    queryFn: async () => {
      const response = await axiosInterceptors.get(`users/bookmarks`);
      return response?.data?.data?.bookmarks || [];
    },
  });
  if (isLoading) return <div> Loading...</div>;
  return (
    <>
      <div className="flex flex-col gap-4">
        {data?.map((e) => (
          <PostCard key={e._id} userPost={e} />
        ))}
      </div>
    </>
  );
}
