import { KeyRound } from "lucide-react";
import AppNavbar from "../../component/AppNavbar/AppNavbar";
import { Input } from "@heroui/react";
import { axiosInterceptors } from "../../shared/axiosInterceptors/axiosInterceptors";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast"; 
import { useNavigate } from "react-router"; 

export default function ChangePassword() {
  const navigate = useNavigate(); 

  const schema = z
    .object({
      currentPassword: z.string().min(1, { message: "Current password is required." }),
      newPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character." }),
      confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset, 
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
  });
  async function changePassword(data) {
    const toastId = toast.loading("Updating password...");
    try {
      const res = await axiosInterceptors.patch(`users/change-password`, {
        password: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed! Logging out...", { id: toastId });
      reset(); 
      setTimeout(() => {
        localStorage.removeItem("token"); 
        navigate("/login"); 
      }, 1500);

      return res;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update password. Please try again.";
      toast.error(errorMessage, { id: toastId });
      console.error("Error changing password", error);
    }
  }

  return (
    <>
      <AppNavbar />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0">
          <div className="mx-auto max-w-2xl">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
                  <KeyRound size={20} />
                </span>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                    Change Password
                  </h1>
                  <p className="text-sm text-slate-500">
                    Keep your account secure by using a strong password.
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit(changePassword)}
                className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Current password
                  </span>
                  <Input
                    isInvalid={!!errors.currentPassword}
                    errorMessage={errors.currentPassword?.message}
                    id="input-type-password"
                    name="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    {...register("currentPassword")}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    New password
                  </span>
                  <Input
                    isInvalid={!!errors.newPassword}
                    errorMessage={errors.newPassword?.message}
                    type="password"
                    placeholder="Enter new password"
                    {...register("newPassword")}
                  />
                  <span className="mt-1 block text-xs text-slate-500">
                    At least 8 characters with uppercase, lowercase, number, and
                    special character.
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">
                    Confirm new password
                  </span>
                  <Input
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message}
                    type="password"
                    placeholder="Re-enter new password"
                    {...register("confirmPassword")}
                  />
                </label>
                <button
                  type="submit"
                  disabled={!isValid}
                  className="cursor-pointer inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60">
                  Update password
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}