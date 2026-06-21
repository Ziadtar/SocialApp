import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  User,
  Divider,
} from "@heroui/react";
import { Home, User as UserIcon, Menu, MessageCircle } from "lucide-react";
import Logo from "../../assets/route.jpg";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider/AuthContextProvider";
import { useLocation, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";

const AppNavbar = () => {
  async function CountUnreaded() {
    const unreadedCounter = await axiosInterceptors.get(
      `notifications/unread-count`,
    );
    return unreadedCounter?.data?.data?.unreadCount;
  }
  const { data } = useQuery({
    queryKey: ["Notifications", "count","Posts"],
    queryFn: CountUnreaded,
  });
  const queryClient = useQueryClient();
  const Navigate = useNavigate();
  const location = useLocation();
  const activeItem = location.pathname;
  const { getUserData, userData, setUserData } = useContext(AuthContext);
  const { name, photo } = userData || {};
  function removeUserToken() {
    localStorage.clear();
    queryClient.clear();
    setUserData(null);
    Navigate("/login");
    getUserData();
  }

  function toProfile() {
    Navigate("/Profile/profileMyPosts");
  }
  function toChangePassword() {
    Navigate("/ChangePassword");
  }
  function toFeed() {
    Navigate("/Layout/feed");
  }
  function toNotifications() {
    Navigate("/Notifications");
  }
  return (
    <Navbar maxWidth="xl" className="bg-white border-b border-slate-100 py-1">
      <NavbarBrand className="gap-3">
        <div className=" px-2 py-1.5 rounded-xl flex items-center justify-center w-15">
          <img src={Logo} alt="Logo" className="rounded-2xl" />
        </div>
        <p className="font-bold text-xl tracking-tight">Route Posts</p>
      </NavbarBrand>
      <NavbarContent
        className="flex gap-1 rounded-[10px] border border-slate-200 px-2 py-1.5 bg-[#f8fafc] h-10 cursor-pointer"
        justify="center">
        <NavItem
          label="Feed"
          Icon={Home}
          isActive={activeItem.startsWith("/Layout")}
          onClick={toFeed}
        />
        <NavItem
          label="Profile"
          Icon={UserIcon}
          isActive={activeItem.startsWith("/Profile")}
          onClick={toProfile}
        />
        <NavItem
          label="Notifications"
          Icon={MessageCircle}
          data={data}
          isActive={activeItem.startsWith("/Notifications")}
          onClick={toNotifications}
        />
      </NavbarContent>
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center gap-3 pr-4 pl-1 py-1 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
              <User
                avatarProps={{
                  src: photo,
                  size: "sm",
                  className: "w-8 h-8",
                }}
                name={name}
                classNames={{
                  name: "font-bold text-[#1e293b] text-sm lowercase",
                }}
              />
              <div className="w-[1.5px] h-4 bg-slate-200"></div>
              <Menu size={20} className="text-slate-400" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions">
            <DropdownItem key="profile" onClick={toProfile}>
              Profile
            </DropdownItem>
            <DropdownItem key="settings" onClick={toChangePassword}>
              Settings
            </DropdownItem>
            <DropdownItem disableAnimation>
              <Divider />
            </DropdownItem>

            <DropdownItem
              key="logout"
              color="danger"
              className="mt-2"
              onClick={removeUserToken}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

// eslint-disable-next-line no-unused-vars
const NavItem = ({ label, Icon, isActive, onClick, data }) => (
  <NavbarItem>
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-[30px] text-sm font-bold transition-all duration-300 cursor-pointer ${
        isActive ?
          " text-[#2563eb] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] cursor-pointer"
        : "text-[#475569] hover:bg-slate-100/50"
      }`}>
      <span className="relative">
        <Icon
          size={18}
          strokeWidth={isActive ? 2.5 : 2}
          fill={isActive ? "currentColor" : "none"}
          className={isActive ? "fill-[#ffffff]" : ""}
        />
        {data > 0 && (
          <span className="absolute -left-2 -top-2 z-10 flex min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-black leading-4 text-white ring-2 ring-white">
            {data}
          </span>
        )}
      </span>
      {label}
    </button>
  </NavbarItem>
);

export default AppNavbar;
