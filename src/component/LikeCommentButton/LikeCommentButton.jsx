import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider/AuthContextProvider";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LikeCommentButton({ likes, commentID, mainID }) {
  const { userData } = useContext(AuthContext);
  const isLiked = likes.includes(userData._id); // Assuming likes is an array of user IDs who liked the comment and see if current user is like post or not
  const queryClient = useQueryClient();

  async function handleLike() {
    return axiosInterceptors.put(`posts/${mainID}/comments/${commentID}/like`);
  }
  const { mutate } = useMutation({
    mutationFn: handleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Comments"] });
    },
  });
  return (
    <>
      <button
        onClick={mutate}
        className={`text-xs font-semibold hover:underline disabled:opacity-60 cursor-pointer ${isLiked ? "text-blue-500" : "text-slate-500"}`}>
        Like {`(${likes?.length})`}
      </button>
    </>
  );
}
