import { ThumbsUp } from "lucide-react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useQuery } from "@tanstack/react-query";

export default function LikeShower({ postData }) {
  async function getLikesCount() {
    return axiosInterceptors.get(`posts/${postData._id}/likes`);
  }
  const { data } = useQuery({
    queryKey: ["likes", postData._id],
    queryFn: getLikesCount,
  });
  const res = data?.data?.data?.likes;
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-white">
          <ThumbsUp className="text-sm w-3 h-3" />
        </span>
        <p className="cursor-pointer px-2 py-1 text-xs text-[#818486]">
          {res?.length || 0} Likes
        </p>
      </div>
    </>
  );
}
