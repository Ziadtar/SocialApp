import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@heroui/react";
import {
  Bookmark,
  BookmarkCheck,
  Ellipsis,
  ExternalLink,
  MessageCircle,
  Pencil,
  Repeat2,
  Trash,
} from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContextProvider/AuthContextProvider";
import CommentCard from "../CommentCard/CommentCard";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CreateComment from "../CreateComment/CreateComment";
import LikeButton from "../LikeButton/LikeButton";
import LikeShower from "../LikeShower/LikeShower";
import CommentShower from "../CommentShower/CommentShower";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import EditPost from "../EditPost/EditPost";
import DeleteCard from "../DeleteCard/DeleteCard";
import { getRelativeTime } from "../../utils/formatTime";
import SharePostCard from "../SharePostCard/SharePostCard";

export default function PostCard({ userPost, idPostDetails }) {
  const [ShowDelete, setShowDelete] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [willedited, setWilledited] = useState(false);
  const {
    image,
    body,
    privacy,
    sharesCount,
    createdAt,
    topComment,
    id,
    bookmarked,
    user,
    isShare,
    sharedPost,
  } = userPost || {};
  // Handle cases where user or sharedPost might be undefined
  const shareUserName = sharedPost?.user?.name || "Unknown User";
  const shareUserUsername = sharedPost?.user?.username || "unknown";
  const shareUserPhoto = sharedPost?.user?.photo || "Unknown User Photo";
  const shareUserImage = sharedPost?.image;
  const shareUserID = sharedPost?.id || "Unknown User ID";
  // Handle cases where user might be undefined
  const name = user?.name || "Unknown User";
  const username = user?.username || "unknown";
  const photo = user?.photo || " ";
  const _id = user?._id || "";
  // Handle cases where user comment might be undefined
  const commentCreatorName = topComment?.commentCreator?.name || "Anonymous";
  const commentContent = topComment?.content || "";
  const commentCreatorPhoto = topComment?.commentCreator?.photo || "";
  const commentCreatorImg = topComment?.image || "";
  const { userData } = useContext(AuthContext);
  const RelativeTime = getRelativeTime(createdAt);
  const mainId = id;
  const isMyPost = _id === userData?.id;
  const sentImData = userPost;

  function showAllComments() {
    setIsHidden(!isHidden);
  }
  async function getComments() {
    return axiosInterceptors.get(`posts/${id}/comments`);
  }
  const { data } = useQuery({
    queryKey: ["Comments", id],
    queryFn: getComments,
  });
  const response = data?.data?.data?.comments;
  const queryClient = useQueryClient();

  const { mutate: handleSavePost } = useMutation({
    mutationFn: async () => {
      return axiosInterceptors.put(`posts/${id}/bookmark`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Posts"] });

      queryClient.invalidateQueries({ queryKey: ["PostDetails", id] });
    },
    onError: (error) => {
      console.error("ERROR with save post :", error);
    },
  });

  return (
    <>
      <Card className="w-full mb-4" id={id}>
        <CardHeader className="flex gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Image
              alt="User logo"
              height={40}
              radius="full"
              src={photo}
              width={40}
            />
            <div className="flex flex-col">
              <p className="self-start text-md">{name}</p>
              <div className="flex space-x-2">
                <p className="text-[12px] text-default-500">@{username} .</p>
                <p className="text-[12px] text-default-500">{RelativeTime} .</p>
                <span>
                  <p className="text-[12px] text-default-500">{privacy}</p>
                </span>
              </div>
            </div>
          </div>
          <div>
            <Dropdown placement="bottom-end">
              <DropdownTrigger className="bg-transparent rounded-full ">
                <Button disableRipple disableAnimation>
                  <Ellipsis />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => handleSavePost()}
                  startContent={<Bookmark size={14} />}>
                  {bookmarked ? "Unsave post" : "Save post"}
                </DropdownItem>
                {!willedited && isMyPost && (
                  <DropdownItem
                    onClick={() => setWilledited(true)}
                    startContent={<Pencil size={14} />}>
                    Edit post
                  </DropdownItem>
                )}
                {isMyPost && (
                  <DropdownItem
                    color="danger"
                    className="text-danger"
                    onClick={() => setShowDelete(true)}
                    startContent={<Trash size={14} />}>
                    Delete Post
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-2 wrap-anywhere">
            {!willedited && (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {body}
              </p>
            )}
            {isShare && (
              <div className="mx-4 my-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={shareUserPhoto}
                      alt={shareUserName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {shareUserName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        @{shareUserUsername}
                      </p>
                    </div>
                    <Link
                      to={`/PostDetails/${shareUserID}`}
                      className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]">
                      Original Post
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                    {sharedPost?.body}
                  </p>
                </div>
                {shareUserImage && (
                  <img
                    src={shareUserImage}
                    alt="Post shared image"
                    className="h-full object-cover w-full"
                  />
                )}
              </div>
            )}
            {willedited && (
              <EditPost
                body={body}
                onCancel={() => setWilledited(false)}
                mainId={mainId}
              />
            )}
            {bookmarked && (
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#e7f3ff] px-2.5 py-1 text-[11px] font-bold text-[#1877f2]">
                <BookmarkCheck size={16} />
                Saved
              </div>
            )}
            {image && (
              <img
                src={image}
                alt="Post"
                className="h-full object-cover w-full"
              />
            )}
          </div>
        </CardBody>
        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-4 justify-between w-full">
            <LikeShower postData={sentImData} />
            <div className="flex justify-between align-center gap-4">
              <span className="flex items-center gap-2">
                <Repeat2 className="w-3 h-3" color="#818486" />
                <p className="px-2 py-1 text-xs text-[#818486]">
                  {sharesCount} shares
                </p>
              </span>
              <CommentShower needed={sentImData} />
              {!idPostDetails && (
                <Link
                  to={`/PostDetails/${id}`}
                  className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]">
                  View details
                </Link>
              )}
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-3  w-full">
            <LikeButton needed={sentImData} />
            <button
              onClick={showAllComments}
              className="cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-slate-600 hover:bg-slate-100">
              <MessageCircle className="text-sm w-3 h-3" />
              comment
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-slate-600 hover:bg-slate-100">
              <Repeat2 className="text-sm w-3 h-3" />
              share
            </button>
          </div>
        </CardFooter>
        {isHidden && (
          <div className="border-t border-slate-200 bg-[#f7f8fa] px-4 py-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold  tracking-wide text-slate-700">
                  Comments
                </p>
                <span className="rounded-full bg-[#e7f3ff] px-2 py-0.5 text-[11px] font-bold text-[#1877f2]">
                  {response?.length}
                </span>
              </div>
              <select className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none ring-[#1877f2]/20 focus:border-[#1877f2] focus:bg-white focus:ring-2">
                <option value="relevant" key="relevant">
                  Most relevant
                </option>
                <option value="Newest" key="Newest">
                  Newest
                </option>
              </select>
            </div>
            <div className="space-y-2">
              {response &&
                response?.map((comment) => (
                  <CommentCard key={comment._id} commentUser={comment} />
                ))}
            </div>
            <div className="mt-3">
              <CreateComment imData={sentImData} />
            </div>
          </div>
        )}
        {!idPostDetails && topComment && (
          <div
            className={`mx-4 mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 flex flex-col items-start ${isHidden ? "hidden" : ""}`}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Top comment
            </p>
            <div className="flex items-start gap-2 w-full">
              <img
                src={commentCreatorPhoto}
                alt={commentCreatorName}
                className="w-6 h-6 rounded-full"
              />
              <div className="min-w-0 flex-1 flex flex-col rounded-2xl bg-white px-3 py-2 items-start">
                <p className="truncate text-xs font-bold text-slate-900">
                  {commentCreatorName}
                </p>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700 wrap-anywhere">
                  {commentContent}
                </p>
                {commentCreatorImg && (
                  <img
                    src={commentCreatorImg}
                    alt="Comment image"
                    className="mt-2 h-full object-cover w-full rounded-lg"
                  />
                )}
              </div>
            </div>
            <button
              className="mt-2 text-xs font-bold text-[#1877f2] hover:underline cursor-pointer"
              onClick={() => {
                setIsHidden(true);
              }}>
              View all comments
            </button>
          </div>
        )}
      </Card>
      {ShowDelete && (
        <DeleteCard mainId={mainId} onclose={() => setShowDelete(false)} />
      )}
      {showShare && (
        <SharePostCard
          image={image}
          body={body}
          username={username}
          name={name}
          photo={photo}
          ID={id}
          onclose={() => setShowShare(false)}
        />
      )}
    </>
  );
}
