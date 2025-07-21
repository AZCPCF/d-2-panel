import { Minus, Plus } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { cn } from "../../../utils/cn";
import { formatNumberWithCommas } from "../../../utils/formater";

const min = 500000;
const max = 10000000;

const WalletDefaultButton = memo(function WalletDefaultButton({
  amount,
  setAmount,
  defAmount,
}: {
  amount: number;
  defAmount: number;
  setAmount: (num: number) => void;
}) {
  const isActive = defAmount === amount;

  const handleClick = useCallback(() => {
    setAmount(amount);
  }, [amount, setAmount]);

  return (
    <div className="flex justify-center" onClick={handleClick}>
      <button
        className={cn(
          "border border-primary-main rounded-md w-max px-3 py-2 text-base hover:bg-primary-main duration-200",
          isActive && "bg-primary-main"
        )}
      >
        {formatNumberWithCommas(amount)} تومان
      </button>
    </div>
  );
});

export default function WalletModal() {
  const [amount, setAmount] = useState(min);

  const formattedAmount = useMemo(
    () => formatNumberWithCommas(amount),
    [amount]
  );

  const setFixedAmount = useCallback((value: number) => {
    setAmount(value);
  }, []);

  const increment = useCallback(() => {
    setAmount((prev) => Math.min(prev + 100000, max));
  }, []);

  const decrement = useCallback(() => {
    setAmount((prev) => Math.max(prev - 100000, min));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = e.target.value.replace(/[^0-9]/g, "");
      const numeric = +cleaned;
      if (cleaned === "" || numeric < min) {
        setAmount(min);
        return;
      }
      if (numeric > max) {
        setAmount(max);
        return;
      }
      setAmount(numeric);
    },
    []
  );

  return (
    <div>
      <p className="text-center text-3xl pb-4">افزایش موجودی کیف پول</p>
      <div className="grid grid-cols-4 gap-3 mt-4">
        {[min, 1000000, 2000000, 4000000].map((btnAmount) => (
          <WalletDefaultButton
            key={btnAmount}
            amount={btnAmount}
            defAmount={amount}
            setAmount={setFixedAmount}
          />
        ))}

        <div className="w-full justify-center col-span-full flex items-center gap-3 mt-4">
          <button
            disabled={amount === max}
            onClick={increment}
            className={cn(
              "text-primary-main w-8 h-8 flex items-center rounded-md mb-4 justify-center border border-primary-main duration-100",
              amount === max
                ? "text-gray-400 border-gray-400 !cursor-not-allowed"
                : "hover:bg-primary-main hover:text-white"
            )}
          >
            <Plus />
          </button>

          <input
            value={formattedAmount}
            onChange={handleInputChange}
            type="text"
            placeholder={`از ${formatNumberWithCommas(
              min
            )} تومان تا ${formatNumberWithCommas(max)}`}
            className="input max-w-6/12"
          />

          <button
            disabled={amount === min}
            onClick={decrement}
            className={cn(
              "text-primary-main w-8 h-8 flex items-center mb-4 rounded-md justify-center border border-primary-main duration-100",
              amount === min
                ? "text-gray-400 border-gray-400 !cursor-not-allowed"
                : "hover:bg-primary-main hover:text-white"
            )}
          >
            <Minus />
          </button>
        </div>

        <div className="w-full flex col-span-full justify-center">
          <button className="w-6/12 bg-primary-main p-2 border border-primary-main rounded-md hover:bg-primary-600 duration-100 mb-4">
            پرداخت {formattedAmount} تومان
          </button>
        </div>
      </div>
    </div>
  );
}
