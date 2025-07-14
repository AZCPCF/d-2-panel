import { useEffect, useState } from "react";

type Props = {
  initialSeconds: number;
  onExpire: () => void;
  onResend: () => void;
  isPending: boolean;
};

export default function OtpTimer({
  initialSeconds,
  onExpire,
  onResend,
  isPending,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  return (
    <div className="text-center text-lg mt-0 text-gray-300 p-2">
      {timeLeft > 0 ? (
        <span>
          ارسال مجدد کد بعد از {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>
      ) : (
        <button
          type="button"
          onClick={onResend}
          disabled={isPending}
          className="text-blue-600 underline disabled:opacity-50"
        >
          {isPending ? "در حال ارسال..." : "ارسال مجدد کد"}
        </button>
      )}
    </div>
  );
}
