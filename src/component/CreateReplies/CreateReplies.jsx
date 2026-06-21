import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageDown, SendHorizontal, Smile, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";

export default function CreateReplies({ UserComment }) {
  const { post, _id } = UserComment;
  const upLoadImg = useRef();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { body: "" },
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [urlImage, seturlImage] = useState("");

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      seturlImage(URL.createObjectURL(file));
    }
  }
  const clearSelectedImage = () => {
    seturlImage("");
    setSelectedImage(null);
    if (upLoadImg.current) {
      upLoadImg.current.value = "";
    }
  };

  async function sendReply(data) {
    if (!data.body.trim() && !selectedImage) return;

    const myFormData = new FormData();
    myFormData.append("content", data.body);
    if (selectedImage) {
      myFormData.append("image", selectedImage);
    }

    return axiosInterceptors.post(
      `posts/${post}/comments/${_id}/replies`,
      myFormData,
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: sendReply,
    onSuccess: () => {
      reset();
      clearSelectedImage();

      // حدث التعليقات بتاعة البوست كله
      queryClient.invalidateQueries({ queryKey: ["Comments"] });

      // وحدث كمان الردود بتاعة الكومنت ده بالذات (لو عاملها لوحدها)
      queryClient.invalidateQueries({ queryKey: ["Comments"] });
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(mutate)}>
        <textarea
          {...register("body")}
          placeholder="Write a reply..."
          className="max-h-30 min-h-9.5 w-full resize-none bg-transparent px-2 py-1 text-xs leading-5 outline-none placeholder:text-slate-500"
          rows="1"></textarea>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <label
              onClick={() => upLoadImg.current?.click()}
              className="inline-flex cursor-pointer items-center justify-center rounded-full p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600">
              <ImageDown className="hover:text-emerald-600" size={14} />
            </label>
            <button
              className="inline-flex items-center justify-center rounded-full p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-amber-500"
              type="button">
              <Smile className="hover:text-amber-500" size={14} />
            </button>
          </div>
          <button
            disabled={isPending}
            className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff] disabled:opacity-100">
            <SendHorizontal />
          </button>
        </div>
        {urlImage && (
          <div className="relative mt-2">
            <img
              src={urlImage}
              className="max-h-52 w-full rounded-lg object-cover"
              alt="Comment preview"
            />
            <button
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
              type="button"
              onClick={clearSelectedImage}>
              <X size={14} />
            </button>
          </div>
        )}
      </form>
      <input
        type="file"
        className="hidden"
        ref={upLoadImg}
        onChange={handleImageUpload}
      />
    </>
  );
}
