import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { getRelativeTime } from "../../utils/formatTime";

export default function RepliesCard({ repliesUser }) {
  const { commentCreator, content, createdAt, likesCount, image } = repliesUser;
  const { photo, name, username } = commentCreator;
  const RelativeTime = getRelativeTime(createdAt);

  return (
    <>
      <div className="relative flex items-start gap-2">
        <img
          src={photo}
          alt={username}
          className="h-6 w-6 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1 text-start">
          <div className="inline-block max-w-fit rounded-2xl bg-[#f0f2f5] px-2.5 py-2">
            <p className="text-[11px] font-bold text-slate-900">{name}</p>
            <p className="text-[11px] text-slate-500">{RelativeTime}</p>
            <p className="mt-1.5 flex items-center justify-between px-1  text-xs text-slate-900">
              {content}
            </p>
            {image && (
              <img
                src={image}
                alt={name}
                className="mt-2 max-h-52 w-full rounded-lg object-cover"
              />
            )}
            <div className="mt-1.5 flex items-center justify-between px-1">
              <button className="text-[11px] font-semibold hover:underline disabled:opacity-60 text-slate-500 cursor-pointer">
                Like ({likesCount})
              </button>
              <Dropdown
                placement="bottom-end"
                classNames={{ content: "min-w-[100px] p-1" }}>
                <DropdownTrigger className="bg-transparent rounded-full">
                  <Button disableRipple disableAnimation className="w-6 h-6">
                    <Ellipsis size={14} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu className="w-32 h-17 p-0">
                  (
                  <DropdownItem startContent={<Pencil size={14} />}>
                    Edit
                  </DropdownItem>
                  ) (
                  <DropdownItem
                    color="danger"
                    className="text-danger"
                    startContent={<Trash size={14} />}>
                    Delete
                  </DropdownItem>
                  )
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
