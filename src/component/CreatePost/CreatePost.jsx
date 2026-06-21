import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
} from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContextProvider/AuthContextProvider";
import { ImageDown, Smile, X } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export default function CreatePost() {
  const imageUpload = useRef();
  const { userData } = useContext(AuthContext);
  const { _id, name, photo } = userData || {};

  const [selectedImage, setSelectedImage] = useState(null);
  const [urlImage, seturlImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { body: "" },
  });

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
    if (imageUpload.current) {
      imageUpload.current.value = "";
    }
  };

  async function sendPost(data) {
    if (!data.body.trim() && !selectedImage) return;

    const myFormData = new FormData();
    myFormData.append("body", data.body);
    if (selectedImage) {
      myFormData.append("image", selectedImage);
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}posts`,
        myFormData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

      if (res.status === 200 || res.status === 201) {
        console.log("Post uploaded successfully!");
        reset();
        clearSelectedImage();
      }
    } catch (error) {
      console.error("Error sending post:", error);
    } finally {
      setIsLoading(false);
    }
  }
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: sendPost,
    onSuccess: () => {
      reset();
      clearSelectedImage();
      queryClient.invalidateQueries({ queryKey: ["Posts"] });
    },
  });
  return (
    <Card className="w-full mb-4">
      <CardHeader className="mb-3 flex items-start gap-3">
        <div className="flex items-center gap-3">
          <Image
            className="h-11 w-11 rounded-full object-cover"
            alt="User avatar"
            height={40}
            radius="full"
            src={photo || "https://via.placeholder.com/150"}
            width={40}
          />
          <div className="flex-1">
            <p className="text-base font-extrabold text-slate-900 place-self-start">
              {name || "User"}
            </p>
            <div className="place-self-start mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
              <select
                name="privacy"
                id="privacy"
                className="bg-transparent outline-none cursor-pointer">
                <option value="public">Public</option>
                <option value="Followers">Followers</option>
                <option value="private">Only me</option>
              </select>
            </div>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(mutate)}>
        <CardBody className="relative py-0">
          <textarea
            {...register("body")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white resize-none"
            placeholder="What's on your mind?"
            rows={3}
          />

          {urlImage && (
            <div className="relative mt-3">
              <img
                src={urlImage}
                alt="Selected preview"
                className="max-h-80 w-full rounded-lg object-cover border border-slate-200"
              />
              <button
                type="button"
                onClick={clearSelectedImage}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/80">
                <X size={16} />
              </button>
            </div>
          )}
        </CardBody>

        <CardFooter className="mt-3 flex flex-col items-stretch gap-3">
          <Divider />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div
                onClick={() => imageUpload.current?.click()}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                <ImageDown className="text-emerald-600" size={18} />
                <span className="hidden sm:inline">Photo/video</span>
                <input
                  ref={imageUpload}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                <Smile className="text-amber-500" size={18} />
                <span className="hidden sm:inline">Feeling/activity</span>
              </button>
            </div>

            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="px-8 font-bold">
              Post
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
