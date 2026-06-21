import { useQuery } from "@tanstack/react-query";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";

export default function CommentShower({ needed }) {
  console.log(needed)
  async function getCommentsCount() {
    return axiosInterceptors.get(`posts/${needed._id}/comments`);
  }
  const { data } = useQuery({
    queryKey: ["Comments" , needed.id],
    queryFn: getCommentsCount,
  });
  const res = data?.data?.data?.comments;
  return (
    <>
      <p className="px-2 py-1 text-xs text-[#818486]">
        {res?.length || 0} comments
      </p>
    </>
  );
}
