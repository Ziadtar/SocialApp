import { Newspaper, Sparkles, Earth, Bookmark } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const checkActive = (pathName) => {
    return currentPath.includes(pathName);
  };
 

  return (
    <>
      <aside className="hidden xl:block xl:sticky xl:top-21 h-fit">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm space-y-1 cursor-pointer">
          <Link
            to="/Layout/feed"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left cursor-pointer text-sm font-bold transition
            ${
              checkActive("/Layout/feed") ?
                "bg-[#e7f3ff] text-[#1877f2]"
              : "text-slate-700 hover:bg-slate-100"
            }`}>
            <Newspaper size={18} /> Feed
          </Link>
          <Link
            to="MyPosts"
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 cursor-pointer text-left text-sm font-bold transition
          ${
            checkActive("MyPosts") ?
              "bg-[#e7f3ff] text-[#1877f2]"
            : "text-slate-700 hover:bg-slate-100"
          }`}>
            <Sparkles size={18} /> My Posts
          </Link>
          <Link
            to="Posts"
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 cursor-pointer text-left text-sm font-bold transition
             ${
               (
                 checkActive("Posts") && !checkActive("MyPosts") // عشان يتأكد إنه Posts مش MyPosts
               ) ?
                 "bg-[#e7f3ff] text-[#1877f2]"
               : "text-slate-700 hover:bg-slate-100"
             }`}>
            <Earth size={18} /> Community
          </Link>
          <Link
            to="Saved"
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 cursor-pointer text-left text-sm font-bold transition
             ${
               checkActive("Saved") ?
                 "bg-[#e7f3ff] text-[#1877f2]"
               : "text-slate-700 hover:bg-slate-100"
             }`}>
            <Bookmark size={18} /> Saved
          </Link>
        </div>
      </aside>
    </>
  );
}
