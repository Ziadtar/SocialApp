import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContextProvider/AuthContextProvider";
import { ImageDown, SendHorizontal, Smile, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// import { useParams } from "react-router";

export default function CreateComment({ imData }) {
  const { _id } = imData;
  const { userData } = useContext(AuthContext);
  const upLoadImg = useRef();
  // const { id } = useParams();

  const queryClient = useQueryClient();

  const { photo, name } = userData;

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

  async function sendComment(data) {
    if (!data.body.trim() && !selectedImage) return;

    const myFormData = new FormData();
    myFormData.append("content", data.body);
    if (selectedImage) {
      myFormData.append("image", selectedImage);
    }

    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}posts/${_id}/comments`,
      myFormData,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );

    return res.data;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: sendComment,
    onSuccess: () => {
      reset();
      clearSelectedImage();
      queryClient.invalidateQueries({ queryKey: ["Comments"] });
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(mutate)}>
        <div className="flex items-start gap-2">
          <img
            src={photo}
            className="h-9 w-9 rounded-full object-cover"
            alt={name}
          />
          <div className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white">
            <textarea
              {...register("body")}
              placeholder={`Comment as ${name}...`}
              className="max-h-35 min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-5 outline-none placeholder:text-slate-500"></textarea>
            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <label
                  onClick={() => upLoadImg.current?.click()}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600">
                  <ImageDown className="text-emerald-600" size={14} />
                </label>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-amber-500">
                  <Smile className="text-amber-500" size={14} />
                </button>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className=" cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff] disabled:opacity-100">
                <SendHorizontal />
              </button>
            </div>
          </div>
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
        accept="image/*"
      />
    </>
  );
}
