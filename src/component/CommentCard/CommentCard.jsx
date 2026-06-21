import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContextProvider/AuthContextProvider";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useQuery } from "@tanstack/react-query";
import RepliesCard from "../RepliesCard/RepliesCard";
import CreateReplies from "../CreateReplies/CreateReplies";
import { getRelativeTime } from "../../utils/formatTime";
import EditComment from "../EditComment/EditComment";
import DeleteCommentCard from "../DeleteCommentCard/DeleteCommentCard";
import LikeCommentButton from "../LikeCommentButton/LikeCommentButton";

export default function CommentCard({ commentUser }) {
  const [editComment, setEditComment] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showReplies, setshowReplies] = useState(true);
  const { userData } = useContext(AuthContext);
  const {
    commentCreator,
    content,
    createdAt,
    likes,
    repliesCount,
    image,
    post,
  } = commentUser;
  const commentID = commentUser._id;
  const { name, photo, username, _id } = commentCreator;
  const isMyPost = _id === userData?.id;
  const RelativeTime = getRelativeTime(createdAt);
  function showAllReplies() {
    setshowReplies(!showReplies);
  }
  function getReply() {
    return axiosInterceptors.get(
      `posts/${post}/comments/${commentUser._id}/replies?page=1&limit=30`,
    );
  }
  const { data, isLoading } = useQuery({
    queryKey: ["Comments", commentUser._id],
    queryFn: getReply,
  });
  const replies = data?.data?.data?.replies || [];
  const neededData = commentUser;
  return (
    <>
      <div className="relative flex items-start gap-2 mainCard w-full">
        <img
          className="mt-0.5 h-8 w-8 rounded-full object-cover"
          src={photo}
          alt={name}
        />
        <div className="min-w-0 flex flex-col grow-2">
          <div className="relative inline-block max-w-fit rounded-2xl bg-[#f0f2f5] px-3 py-2 float-start">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-900 text-start">
                  {name}
                </p>
                <p className="text-xs text-slate-500">
                  @{username} . {RelativeTime}
                </p>
              </div>
            </div>
            {!editComment && (
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800 text-start wrap-break-word">
                {content}
              </p>
            )}
            {editComment && (
              <EditComment
                oncancel={() => setEditComment(false)}
                content={content}
                id={post}
                commentId={commentUser._id}
              />
            )}
            {image && (
              <img
                src={image}
                alt={name}
                className="mt-2 max-h-52 w-full rounded-lg object-cover"
              />
            )}
          </div>
          <div className="mt-1.5 flex items-center justify-between px-1">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-400">
                {RelativeTime}
              </span>
              <LikeCommentButton
                likes={likes}
                commentID={commentID}
                mainID={post}
              />
              <button
                onClick={showAllReplies}
                className="cursor-pointer text-xs font-semibold transition hover:underline disabled:opacity-60 text-slate-500 hover:text-[#1877f2]">
                Reply ({repliesCount})
              </button>
            </div>
            {isMyPost && (
              <div className="relative">
                <Dropdown
                  placement="bottom-end"
                  classNames={{ content: "min-w-[100px] p-1" }}>
                  <DropdownTrigger className="bg-transparent rounded-full">
                    <Button disableRipple disableAnimation className="w-6 h-6">
                      <Ellipsis size={14} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu className="w-32 p-0">
                    {!editComment && (
                      <DropdownItem
                        onClick={() => setEditComment(true)}
                        startContent={<Pencil size={14} />}>
                        Edit
                      </DropdownItem>
                    )}
                    <DropdownItem
                      onClick={() => setShowDelete(!showDelete)}
                      color="danger"
                      className="text-danger"
                      startContent={<Trash size={14} />}>
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
          <div
            className={`relative mt-2 ml-5 pl-4 ${showReplies ? "hidden" : ""}`}>
            <span className="absolute bottom-10 left-0 top-1 w-px rounded-full bg-slate-300"></span>
            <div className="space-y-3">
              {isLoading ?
                <div className="flex items-start gap-2 animate-pulse mt-1">
                  <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200"></div>
                  <div className="flex w-full flex-col gap-1.5">
                    <div className="h-12 w-3/4 rounded-2xl bg-slate-200"></div>
                    <div className="flex gap-3 px-2 mt-1">
                      <div className="h-2 w-8 rounded bg-slate-200"></div>
                      <div className="h-2 w-8 rounded bg-slate-200"></div>
                    </div>
                  </div>
                </div>
              : replies?.length > 0 ?
                replies.map((rep, index) => (
                  <RepliesCard key={rep._id} repliesUser={rep} index={index} />
                ))
              : <p className="text-xs text-slate-500 justify-self-start">
                  No replies yet.
                </p>
              }
            </div>
            <div className="mt-2 flex flex-coCreateRepliesl self-start space-x-3">
              <p className="mb-1 text-[11px] font-semibold text-slate-500 text-start">
                Replying to {name}
              </p>
              <div className="flex items-start gap-2 grow">
                <img
                  src={userData.photo}
                  className="mt-0.5 h-7 w-7 rounded-full object-cover"
                  alt={userData.name}
                />
                <div className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white">
                  <CreateReplies UserComment={neededData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDelete && (
        <DeleteCommentCard
          onclose={() => setShowDelete(false)}
          commentID={commentID}
          mainID={post}
        />
      )}
    </>
  );
}
