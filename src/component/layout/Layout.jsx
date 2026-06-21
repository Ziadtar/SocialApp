import { Outlet } from "react-router";
import AppNavbar from "../AppNavbar/AppNavbar";
import Sidebar from "../sidebar/Sidebar";
import Suggestions from "../Suggestions/Suggestions";
import CreatePost from "../CreatePost/CreatePost";

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <AppNavbar />
      <div className="text-center  container justify-self-center min-h-screen">
        <div className=" grid grid-cols-13 gap-4 p-4 mt-1 min-h-screen ">
          <div className="col-span-3">
            <Sidebar />
          </div>
          <div className="col-span-7 ">
            <CreatePost />
            <Outlet/>
          </div>
          <div className="col-span-3 ">
            <Suggestions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
