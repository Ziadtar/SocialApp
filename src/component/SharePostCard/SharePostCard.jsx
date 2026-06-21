import { X } from "lucide-react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function SharePostCard({
  photo,
  name,
  username,
  body,
  onclose,
  image,
  ID,
}) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: { body: "" },
  });
  async function handleShare(data) {
    onclose();
    return axiosInterceptors.post(`posts/${ID}/share`, { body: data.body });
  }
  const { mutate, isPending } = useMutation({
    mutationFn: handleShare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Posts"] });
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(handleShare)}>
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-slate-900/20 p-4">
          <div className="w-full max-w-140 rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h4 className="text-base font-extrabold text-slate-900">
                Share post
              </h4>
              <button
                className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-60"
                onClick={onclose}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <textarea
                {...register("body")}
                placeholder="Say something about this..."
                rows="3"
                maxLength="500"
                className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20"></textarea>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <img
                    src={photo}
                    alt={name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {name}
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-500">
                      @{username}
                    </p>
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800 justify-self-start">
                  {body}
                </p>
                {image && (
                  <img
                    className="mt-2 max-h-55 w-full rounded-lg object-cover"
                    src={image}
                    alt="post preview"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <button
                onClick={onclose}
                className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60">
                Cancel
              </button>
              <button
                onClick={handleSubmit(mutate)}
                className="cursor-pointer inline-flex items-center rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60">
                {isPending ? "Sharing..." : "Share now"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
