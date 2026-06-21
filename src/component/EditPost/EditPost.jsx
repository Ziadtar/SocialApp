import React, { useState } from "react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditPost({ body, onCancel, mainId }) {
  const id = mainId;
  const [text, setText] = useState(body);
  const queryClient = useQueryClient();
  async function updatePost() {
    const neededFormData = new FormData();
    neededFormData.append("body", text);
    neededFormData.append("image", "null");

    return await axiosInterceptors.put(`posts/${id}`, neededFormData);
  }
  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Posts"] });
      onCancel();
    },
    onError: (error) => {
      console.error("Error updating post:", error);
    },
  });
  return (
    <>
      <div className="mt-3" onClick={() => console.log(id)}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={5000}
          className="min-h-27.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[#1877f2]/20 focus:border-[#1877f2] focus:ring-2"></textarea>
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={() => mutate()}
            className="cursor-pointer rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60">
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
