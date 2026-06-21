import React, { useState } from "react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useQueryClient } from "@tanstack/react-query";
import { TriangleAlert, X } from "lucide-react";

export default function DeleteCard({ onclose, mainId }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const id = mainId;

  function DeletePost() {
    return axiosInterceptors.delete(`posts/${id}`);
  }
  const queryClient = useQueryClient();

  async function deleteAndHidden() {
    onclose();
    try {
      await DeletePost();
      setIsDeleted(true);

      queryClient.invalidateQueries({ queryKey: ["Posts"] });
    } catch (error) {
      console.error("error with delete post:", error);
      return Promise.reject(error);
    }
  }
  if (isDeleted) return null;
  return (
    <>
      <div className="fixed inset-0 z-90 flex items-center justify-center bg-slate-900/20 p-4">
        <div className="w-full max-w-130 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h4 className="text-base font-extrabold text-slate-900">
              Confirm action
            </h4>
            <button
              type="button"
              onClick={() => onclose()}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer">
              <X />
            </button>
          </div>
          <div className="flex items-start gap-3 p-4">
            <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <TriangleAlert />
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-slate-900 justify-self-start">
                Delete this post?
              </h5>
              <p className="mt-1 text-sm text-slate-601">
                This post will be permanently removed from your profile and
                feed.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
            <button
              onClick={() => onclose()}
              type="button"
              className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
              cancel
            </button>
            <button
              onClick={() => deleteAndHidden()}
              type="button"
              className="cursor-pointer rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70">
              Delete post
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
