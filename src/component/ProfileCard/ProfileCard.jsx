import { Clock, MessageCircle, Repeat2, ThumbsUp } from "lucide-react";
import { Link } from "react-router";
import { formatPostDate } from "../../utils/formatPostDate";

export default function ProfileCard({ MyuserPost }) {
  const {
    body,
    likesCount,
    sharesCount,
    commentsCount,
    user,
    createdAt,
    _id,
    image,
  } = MyuserPost;
  const formattedDate = formatPostDate(createdAt);
  console.log(formattedDate);
  return (
    <>
      <article
        id={_id}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_6px_rgba(15,23,42,.05)] transition hover:shadow-sm">
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <img
                src={user?.photo || "https://via.placeholder.com/150"}
                alt="user profile photo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-900">
                  {user?.name || "John Doe"}
                </p>
                <p className="truncate text-xs font-semibold text-slate-500">
                  {user?.username || "Software Engineer"}
                </p>
              </div>
            </div>
            <Link
              to={`/PostDetails/${_id}`}
              className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] transition hover:bg-[#e7f3ff] cursor-pointer">
              View details
            </Link>
          </div>
          <div className="pt-3">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
              {body}
            </p>
          </div>
        </div>
        {image && (
          <div className="border-y border-slate-200 bg-slate-950/95">
            <button className="group relative flex w-full cursor-zoom-in items-center justify-center">
              <img
                src={image}
                alt="Post image"
                className="max-h-140 w-auto max-w-full object-contain"
              />
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <span className="inline-flex items-center gap-2 font-semibold">
              <ThumbsUp size={14} />
              {likesCount} likes
            </span>
            <span className="inline-flex items-center gap-2 font-semibold">
              <Repeat2 size={14} />
              {sharesCount} shares
            </span>
            <span className="inline-flex items-center gap-2 font-semibold">
              <MessageCircle size={14} />
              {commentsCount} comments
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Clock size={12} />
            {formattedDate}
          </span>
        </div>
      </article>
    </>
  );
}
