import { useRef, useState } from "react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditComment({ oncancel, content, id, commentId }) {
  const [text, setText] = useState(content);
  const queryClient = useQueryClient();

  async function updatePost() {
    const neededFormData = new FormData();
    neededFormData.append("content", text);

    return await axiosInterceptors.put(
      `posts/${id}/comments/${commentId}`,
      neededFormData,
    );
  }
  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Comments"] });
      oncancel();
    },
    onError: (error) => {
      console.error("Error updating post:", error);
    },
  });
  const updateContent = useRef(null);
  return (
    <>
      <div className="mt-2 flex items-center gap-2">
        <input
          ref={updateContent}
          defaultValue={content}
          onChange={(e) => setText(e.target.value)}
          type="text"
          className="w-full rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm"
          onClick={() => console.log(commentId)}
        />
        <button
          disabled={isPending}
          onClick={() => mutate()}
          className="cursor-pointer rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60">
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => oncancel()}
          type="button"
          className="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100">
          cancel
        </button>
      </div>
    </>
  );
}
