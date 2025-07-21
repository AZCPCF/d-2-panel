import type { Wallet } from "../../../app/wallet/page";
import { formatNumberWithCommas } from "../../../utils/formater";

export default function WalletCard({ wallet }: { wallet: Wallet }) {
  return (
    <div
      key={wallet.id}
      className={`rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200 bg-background`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-base text-primary truncate text-primary-600 flex items-center gap-2">
          {formatNumberWithCommas(wallet.amount)} تومان
        </h3>
        <span className="text-md dark:text-white truncate">
          {wallet.date.jdate}
        </span>
      </div>
    </div>
  );
}
