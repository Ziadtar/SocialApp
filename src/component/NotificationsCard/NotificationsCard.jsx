import {
  Check,
  Heart,
  MessageCircle,
  Repeat2,
  UserRoundPlus,
} from "lucide-react";
import MarkAsReadSingle from "../MarkAsReadSingle/MarkAsReadSingle";

export default function NotificationsCard({ userNotification }) {
  const { actor, isRead, type, entity, _id } = userNotification;
  const { body } = entity;
  const actionText = {
    comment_post: {
      text: "commented on your post",
      icon: MessageCircle,
      color: "text-blue-500",
    },
    like_post: { text: "liked your post", icon: Heart, color: "text-red-500" },
    follow_user: {
      text: "followed you",
      icon: UserRoundPlus,
      color: "text-purple-500",
    },
    share_post: {
      text: "shared your post",
      icon: Repeat2,
      color: "text-green-500",
    },
  };
  const currentAction = actionText[type];
  const Icon = currentAction ? currentAction.icon : null;
  return (
    <>
      <article
        className={`group relative flex gap-3 rounded-xl border p-3 transition sm:rounded-2xl sm:p-4 ${isRead ? "border-slate-200 bg-white hover:bg-slate-50" : "border-[#dbeafe] bg-[#edf4ff]"}`}>
        <div className="relative shrink-0">
          <button className="block cursor-pointer">
            <img
              src={actor.photo}
              alt={actor.name}
              className="h-11 w-11 rounded-full object-cover"
            />
          </button>
          {currentAction && Icon && (
            <span
              className={`absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white ${currentAction.color}`}>
              <Icon size={12} color="currentColor" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
            {actionText[type] && (
              <p className="text-sm leading-6 text-slate-800">
                <button className="font-extrabold hover:text-[#1877f2] hover:underline pe-1 cursor-pointer">
                  {actor.name}
                </button>
                {actionText[type].text}
              </p>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-semibold text-slate-500">3d</span>
            </div>
          </div>
          <p className="mt-0.5 text-sm text-slate-600">{body}</p>
          <div className="mt-2 flex items-center gap-2">
            {isRead ?
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <Check />
                Read
              </span>
            : <MarkAsReadSingle NotificationID={_id} />}
          </div>
        </div>
      </article>
    </>
  );
}
