import { ThumbsUp } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider/AuthContextProvider";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 

export default function LikeButton({ needed }) {
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const selfLike = userData?._id;
  const postId = needed._id;

  async function getLikes() {
    return axiosInterceptors.get(`posts/${postId}/likes?page=1&limit=20`);
  }

  const { data, isLoading } = useQuery({
    queryKey: ["likes", postId],
    queryFn: getLikes,
  });

  const res = data?.data?.data?.likes || [];
  const isFound = res.some(
    (person) => person._id === selfLike || person.id === selfLike,
  );

  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: async () => {
      return axiosInterceptors.put(`posts/${postId}/like`);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["likes", postId] });

      const previousLikes = queryClient.getQueryData(["likes", postId]);

      queryClient.setQueryData(["likes", postId], (oldData) => {
        if (!oldData) return oldData;

        const currentLikes = oldData.data.data.likes || [];
        const alreadyLiked = currentLikes.some(
          (u) => u._id === selfLike || u.id === selfLike,
        );

        const updatedLikes =
          alreadyLiked ?
            currentLikes.filter((u) => u._id !== selfLike && u.id !== selfLike)
          : [...currentLikes, { _id: selfLike, id: selfLike }];
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: {
              ...oldData.data.data,
              likes: updatedLikes,
            },
          },
        };
      });

      return { previousLikes };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(["likes", postId], context.previousLikes);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });

  return (
    <>
      <button
        onClick={() => toggleLike()}
        disabled={isLoading || isPending}
        className={`cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm ${
          isFound ?
            "bg-[#e7f3ff] text-[#1877f2]"
          : "text-slate-600 hover:bg-slate-100"
        }`}>
        <ThumbsUp
          className={`text-sm w-3 h-3 ${isFound ? "fill-[#1877f2]" : ""}`}
        />
        {/* لو الداتا بتحمل هنكتب Loading، لو خلصت هنكتب Like عادي */}
        {isLoading ? "Loading..." : "Like"}
      </button>
    </>
  );
}
