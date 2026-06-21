import {  Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Key, SmsTracking, User } from "iconsax-reactjs";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import * as Zod from "zod";
import AppButton from "../../../shared/appButton/appButton";
import { AuthContext } from "../../../component/context/AuthContextProvider/AuthContextProvider";

const schema = Zod.object({
  username: Zod.string("Username is optional")
    .regex(
      /^(?=.{4,32}$)(?![_.-])(?!.*[_.]{2})[a-zA-Z0-9._-]+(?<![_.])$/gm,
      "Enter Valid Username",
    )
    .optional(),
  email: Zod.email("Email Must be text")
    .regex(/^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/gm, "Enter Valid Mail")
    .nonempty("Email is Required"),
  password: Zod.string().regex(
    /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
    "Your Passwork is Wrong",
  ),
});
export const Login = () => {
  const { getUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, SetIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
  });
  async function sendUserLogin(values) {
    SetIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}users/signin`,
        values,
      );
      const message = res.data.message;
      const token = res.data.data.token;
      localStorage.setItem("token", token);
      await getUserData();
      toast.success(message || "Logged in successfully!");
      navigate("/Layout/feed");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      SetIsLoading(false);
    }
  }
  return (
    <>
      <section className="bg-[#f2f6ff] min-h-screen flex items-center  p-6 font-sans">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left ">
            <div>
              <h1 className="text-[#00298D] text-[60px] font-extrabold leading-15 ">
                Route Posts
              </h1>
              <p className="text-[24px] font-medium leading-8.25 mt-4 max-w-2xl">
                Connect with friends and the world around you on Route Posts.
              </p>
            </div>
            <div className="info-card p-5 rounded-xl mt-6 bg-white shadow-sm">
              <h3 className="text-[14px] font-extrabold leading-5 tracking-widest text-[#00298D]">
                About Route Academy
              </h3>
              <h2 className="text-[18px] font-bold leading-7 mt-1">
                Egypt's Leading IT Training Center Since 2012
              </h2>
              <p className="text-sm font-normal leading-relaxed mt-2 tracking-wide text-slate-700">
                Route Academy is the premier IT training center in Egypt,
                established in 2012. We specialize in delivering high-quality
                training courses in programming, web development, and
                application development. We've identified the unique challenges
                people may face when learning new technology and made efforts to
                provide strategies to overcome them.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-[#00298d]">
                    2012
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    founded
                  </p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-[#00298d]">
                    40K+
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Graduates
                  </p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-[#00298d]">50+</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Partner Companies
                  </p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-[#00298d]">5</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Branches
                  </p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2">
                  <p className="text-base font-extrabold text-[#00298d]">20</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    Diplomas Available
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 w-full max-w-107.5 lg:order-2">
            <div className="p-5 rounded-x1 mt-6 bg-white shadow-sm rounded-3xl">
              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 mb-5">
                <Link
                  to="/login"
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`font-extrabold rounded-lg transition-all duration-300 cursor-pointer px-6 text-center ${
                    activeTab === "login" ?
                      "py-2 text-[14px] bg-white shadow-md text-[#00298d]"
                    : "py-2 text-sm text-slate-500 hover:text-slate-800"
                  }`}>
                  Login
                </Link>
                <Link
                  to="/Register"
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className={`font-extrabold rounded-lg transition-all duration-300 cursor-pointer px-6 text-center ${
                    activeTab === "register" ?
                      "py-2 text-[14px] bg-white shadow-md text-[#00298d]"
                    : "py-2 text-sm text-slate-500 hover:text-slate-800"
                  }`}>
                  Register
                </Link>
              </div>
              <p className="text-[24px] font-extrabold leading-8">
                Log in to Route Posts
              </p>
              <p className="text-[14px] leading-6 font-normal text-[#6c7d96] ">
                Log in and continue your social journey.
              </p>
              <Form
                onSubmit={handleSubmit(sendUserLogin)}
                className=" mt-4 space-y-4">
                <Input
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  labelPlacement="outside"
                  name="Email"
                  placeholder="Email Address"
                  startContent={
                    <SmsTracking size="18" color="#90A1B9" className="me-1" />
                  }
                  type="email"
                  {...register("email")}
                />
                <Input
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  labelPlacement="outside"
                  name="Password"
                  placeholder="Password"
                  startContent={
                    <Key size="22" color="#90A1B9" className="me-1" />
                  }
                  type="Password"
                  {...register("password")}
                />
                <AppButton isLoading={isLoading} text="Login" />
                <Link className="w-full text-center text-blue-800 text-sm font-semibold leading-5 hover:underline">
                  Forget Password?
                </Link>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
