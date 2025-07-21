import WalletCard from "../../components/pages/wallet/card";
import WalletModal from "../../components/pages/wallet/modal";
import Divider from "../../components/ui/divider";
import useModal from "../../hooks/use-modal";
import { useReactQuery } from "../../hooks/use-query";
import { formatNumberWithCommas } from "../../utils/formater";

export type Wallet = {
  id: number;
  amount: number;
  date: { jdate: string };
};

const staticWalletData: { wallet_amount: number; data: Wallet[] } = {
  wallet_amount: 4500000,
  data: [
    {
      id: 1,
      amount: 1000000,
      date: { jdate: "1404/04/10" },
    },
    {
      id: 2,
      amount: 1500000,
      date: { jdate: "1404/04/12" },
    },
    {
      id: 3,
      amount: 2000000,
      date: { jdate: "1404/04/14" },
    },
  ],
};

export default function WalletPage() {
  const { Modal, modalOpener } = useModal();
  const { data } = useReactQuery<{ wallet_amount: number; data: Wallet[] }>({
    endpoint: "wallet",
  });
  return (
    <>
      <Modal />
      <Divider
        title={`کیف پول - موجودی : ${formatNumberWithCommas(
          data?.wallet_amount || 0
        )} تومان`}
        button={{
          title: "موجودی",
          onClick: () => {
            modalOpener(<WalletModal />);
          },
        }}
      />

      <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 mt-6 gap-4">
        {data?.data.length
          ? data.data.map((item) => <WalletCard key={item.id} wallet={item} />)
          : staticWalletData.data.map((item) => (
              <WalletCard key={item.id} wallet={item} />
            ))}
      </div>
    </>
  );
}
