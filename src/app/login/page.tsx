import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/auth-context";
import { useReactMutation } from "../../hooks/use-mutation";
import { cn } from "../../utils/cn";
import { appUrl } from "../../utils/env";
import { toggleTheme } from "../../utils/toggle-theme";
import { otpSchema, phoneSchema } from "../../validations/login";

export default function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isVerifying, setIsVerifying] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(0);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, navigate]);

  // Countdown Timer
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && step === "otp") {
      setStep("phone");
    }
  }, [step, timer]);

  const loginMutation = useReactMutation<{
    message: string;
    success: boolean;
    data: { minutes: number; seconds: number } | string;
    auth: string;
  }>();

  const phoneForm = useForm({
    defaultValues: { phone: "" },
    onSubmit: async ({ value }) => {
      await submitPhoneNumber(value.phone);
    },
  });

  const submitPhoneNumber = async (phone: string) => {
    const parsed = phoneSchema.safeParse({ phone_number: phone });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    await loginMutation.mutateAsync(
      {
        endpoint: "user_login",
        method: "POST",
        apiUrl: "primary",
        body: {
          phone_number: phone,
        },
      },
      {
        onSuccess: ({ data }) => {
          if (typeof data !== "string") {
            const totalSeconds = (data.minutes ?? 0) * 60 + (data.seconds ?? 0);
            setStep("otp");
            setOtp(Array(6).fill(""));
            setTimer(totalSeconds);
            toast.success("کد با موفقیت ارسال شد.");
          }
        },
      }
    );
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.join("").length === 6 && newOtp.every((digit) => digit)) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (code: string) => {
    const result = otpSchema.safeParse(code);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setIsVerifying(true);

    await loginMutation.mutateAsync(
      {
        endpoint: "user_login",
        method: "POST",
        apiUrl: "primary",
        body: {
          phone_number: (
            document.querySelector(
              "#phone-number-input-login"
            ) as HTMLInputElement
          ).value,
          otp: code,
        },
      },
      {
        onSuccess: ({ data }) => {
          if (typeof data == "string") {
            login(data);
            navigate({ to: "/" });
            toast.success("با موفقیت وارد شدید.");
            setIsVerifying(false);
          }
        },
        onError: () => {
          toast.error("کد ارسالی اشتباه است.");
          setIsVerifying(false);
        },
      }
    );
  };

  const handleResend = async () => {
    const phone = phoneForm.getFieldValue("phone");
    await submitPhoneNumber(phone);
  };

  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-[url(/login-back.webp)] dark:bg-[url(/login-back-dark.webp)] bg-cover">
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 bg-white/80 dark:bg-black/40 p-2 rounded-full shadow-md text-2xl z-10 text-primary-main"
      >
        <Moon className="hidden dark:block" />
        <Sun className="dark:hidden" />
      </button>

      <div className="max-w-[400px] max-sm:max-w-[340px] w-[400px] mx-auto mt-10 p-4 rounded-lg shadow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base backdrop-blur-[8px] bg-black/30 dark:bg-black/40 text-white">
        <div className="flex justify-center flex-wrap gap-3 pb-4">
          <img src={logo} className="max-w-32 brightness-0 invert-100" />
          <h2 className="text-xl font-bold mb-4 text-center w-full">
            ورود و ثبت نام
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            phoneForm.handleSubmit();
          }}
        >
          <phoneForm.Field
            name="phone"
            validators={{
              onChange: ({ value }) =>
                phoneSchema.shape.phone_number.safeParse(value).success
                  ? undefined
                  : "فرمت شماره تماس معتبر نمی باشد",
            }}
          >
            {(field) => (
              <div className="mb-4">
                <label className="block mb-1">
                  شماره تماس خود را وارد کنید.
                </label>
                <input
                  type="tel"
                  disabled={step === "otp"}
                  id="phone-number-input-login"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border px-3 py-2 rounded disabled:bg-gray-500/40 cursor-auto"
                  placeholder="09123456789"
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </phoneForm.Field>

          {loginMutation.error && step == "phone" && (
            <p className="text-red-500 py-2 text-center">
              {(loginMutation.error as Error).message}
            </p>
          )}

          {step === "phone" && (
            <button
              type="submit"
              className="w-full bg-primary-main text-white py-2 rounded not-disabled:hover:bg-primary-600/75 disabled:cursor-progress disabled:opacity-50"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "در حال ارسال کد..." : "دریافت کد"}
            </button>
          )}
        </form>

        {step === "otp" && (
          <>
            <div className="flex justify-center gap-2 mt-4 direction-rtl">
              {[...otp].reverse().map((_, idx) => {
                const i = 5 - idx;

                return (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-10 text-center text-xl border rounded"
                    value={otp[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleBackspace(i, e)}
                  />
                );
              })}
            </div>
            {isVerifying && (
              <div className="flex justify-center mt-4">
                <div className="w-6 h-6 border-2 border-primary-main border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <div
              className={cn(
                "text-center text-lg mt-2 text-gray-300 p-2",
                isVerifying && "hidden"
              )}
            >
              {timer > 0 ? (
                <span>
                  ارسال مجدد کد بعد از {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loginMutation.isPending}
                  className="text-blue-600 underline disabled:opacity-50"
                >
                  {loginMutation.isPending
                    ? "در حال ارسال..."
                    : "ارسال مجدد کد"}
                </button>
              )}
            </div>
          </>
        )}

        <p className="text-center py-3 gap-2 flex justify-center">
          ورود شما به معنای پذیرش <Link to={`${appUrl}/rules`}>قوانین</Link> و{" "}
          <Link to={`${appUrl}/privacy`}>حریم خصوصی</Link> است.
        </p>
      </div>
    </div>
  );
}
