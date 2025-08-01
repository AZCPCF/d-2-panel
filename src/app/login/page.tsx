import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import logo from "../../assets/images/logo.png";
import OtpTimer from "../../components/login/timer";
import { useAuth } from "../../context/auth-context";
import { useReactMutation } from "../../hooks/use-mutation";
import { cn } from "../../utils/cn";
import { appUrl } from "../../utils/env";
import { toggleTheme } from "../../utils/toggle-theme";
import { newUserSchema, otpSchema, phoneSchema } from "../../validations/login";

export default function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp" | "new">("phone");
  const [isVerifying, setIsVerifying] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, navigate]);

  const [otpTimerSeconds, setOtpTimerSeconds] = useState<number | null>(null);
  const newUserForm = useForm({
    defaultValues: {
      referral_id: "",
      full_name: "",
    },
    onSubmit: async ({ value }) => {
      const otpCode = otp.join("");
      const result = newUserSchema.safeParse({ ...value, otp: otpCode });

      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }

      setIsVerifying(true);

      await loginMutation.mutateAsync(
        {
          endpoint: "user_login",
          method: "POST",
          apiUrl: "secondary",
          body: {
            phone_number: (
              document.querySelector(
                "#phone-number-input-login"
              ) as HTMLInputElement
            ).value,
            full_name: value.full_name,
            referral_id: value.referral_id || undefined,
            otp: otpCode,
          },
        },
        {
          onSuccess: ({ data }) => {
            if (typeof data == "string") {
              login(data);
              navigate({ to: "/" });
              toast.success("ورود با موفقیت انجام شد.");
            }
            setIsVerifying(false);
          },
          onError: () => {
            toast.error("کد یا اطلاعات اشتباه است.");
            setIsVerifying(false);
          },
        }
      );
    },
  });

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
        apiUrl: "secondary",
        body: {
          phone_number: phone,
        },
      },
      {
        onSuccess: ({ data, auth }) => {
          if (typeof data !== "string") {
            const totalSeconds = (data.minutes ?? 0) * 60 + (data.seconds ?? 0);
            if (auth == "new") {
              setStep("new");
            } else {
              setStep("otp");
            }
            setOtp(Array(6).fill(""));
            setOtpTimerSeconds(totalSeconds);
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
        apiUrl: "secondary",
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
        onSuccess: async ({ data }) => {
          if (typeof data == "string") {
            login(data);
            await fetch(`${appUrl}/token-setter`, {
              body: JSON.stringify({ token: data }),
              method: "POST",
            });
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
  useEffect(() => {
    if (step == "otp") {
      (document?.querySelector("#otp-input-0") as HTMLInputElement)?.focus();
    }
  }, [step]);
  return (
    <div className="w-screen min-h-screen overflow-auto absolute top-0 left-0 bg-[url(/login-back.webp)] dark:bg-[url(/login-back-dark.webp)] bg-cover">
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 bg-white dark:bg-black/40 p-2 rounded-full shadow-md text-2xl z-10 text-primary-main"
      >
        <Moon className="hidden dark:block" />
        <Sun className="dark:hidden" />
      </button>

      <div className="max-[510px]:max-w-[450px] max-[456px]:w-[360px] w-[500px] mx-auto mt-10 p-4 rounded-lg shadow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl max-sm:text-xl max-[500px]:!text-base backdrop-blur-[8px] bg-black/30 dark:bg-black/40 text-white">
        <div
          className="flex justify-center flex-wrap gap-3 pb-4 data-[step=new]:pb-2 data-[step=new]:gap-1"
          data-step={step}
        >
          <img src={logo} className="max-w-32 brightness-0 invert-100" />
          <h2
            className="text-xl font-bold mb-4 text-center w-full data-[step=new]:mb-2"
            data-step={step}
          >
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
                <label className="block mb-1">شماره تماس</label>
                <input
                  type="tel"
                  disabled={step !== "phone"}
                  id="phone-number-input-login"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="login-input disabled:bg-gray-500/40 disabled:cursor-not-allowed"
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
              className="w-full bg-primary-main text-white duration-100 py-2 rounded-lg not-disabled:hover:bg-primary-600/75 disabled:cursor-progress disabled:opacity-50"
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
                    id={`otp-input-${i}`}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-10 text-center text-xl border rounded-lg"
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
              {step === "otp" && otpTimerSeconds !== null && !isVerifying && (
                <OtpTimer
                  key={otpTimerSeconds} // ensures reset on new OTP
                  initialSeconds={otpTimerSeconds}
                  onExpire={() => setStep("phone")}
                  onResend={handleResend}
                  isPending={loginMutation.isPending}
                />
              )}
            </div>
          </>
        )}
        {step === "new" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              newUserForm.handleSubmit();
            }}
            className="mt-0 space-y-1 text-xl max-sm:text-xl max-[500px]:!text-base"
          >
            <div className="space-y-3">
              <newUserForm.Field name="full_name">
                {(field) => (
                  <div className="space-y-3">
                    <label className="text-gray-200">نام و نام خانوداگی</label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="login-input"
                    />
                    {field.state.meta.errors?.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </newUserForm.Field>

              <newUserForm.Field name="referral_id">
                {(field) => (
                  <div className="space-y-1">
                    <label className="text-gray-200">کد معرف (اختیاری)</label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="login-input"
                      placeholder="کد معرف را وارد کنید"
                    />
                  </div>
                )}
              </newUserForm.Field>
            </div>

            <div className="mt-0">
              <label className="block text-sm text-gray-200 text-center mb-2">
                کد تأیید را وارد کنید
              </label>
              <div className="flex justify-center gap-2 direction-rtl">
                {[...otp].reverse().map((_, idx) => {
                  const i = 5 - idx;
                  return (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      id={`otp-input-${i}`}
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-10 text-center text-xl bg-white/10 border border-white/30 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-main"
                      value={otp[i]}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleBackspace(i, e)}
                    />
                  );
                })}
              </div>
            </div>

            {step === "new" && otpTimerSeconds !== null && !isVerifying && (
              <OtpTimer
                key={otpTimerSeconds} // ensures reset on new OTP
                initialSeconds={otpTimerSeconds}
                onExpire={() => setStep("phone")}
                onResend={handleResend}
                isPending={loginMutation.isPending}
              />
            )}

            {isVerifying && (
              <div className="flex justify-center mt-4">
                <div className="w-6 h-6 border-2 border-primary-main border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full mt-0 bg-primary-main text-white py-2 rounded-lg hover:bg-primary-600/75 disabled:opacity-50"
            >
              تایید و ادامه
            </button>
          </form>
        )}

        <p className="text-center py-3 gap-2 flex justify-center">
          ورود شما به معنای پذیرش <Link to={`${appUrl}/rules`}>قوانین</Link> و{" "}
          <Link to={`${appUrl}/privacy`}>حریم خصوصی</Link> است.
        </p>
      </div>
    </div>
  );
}
