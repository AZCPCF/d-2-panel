import WalletCard from "../../components/pages/wallet/card";
import WalletModal from "../../components/pages/wallet/modal";
import Divider from "../../components/ui/divider";
import NotFound from "../../components/ui/not-found";
import useModal from "../../hooks/use-modal";
import { useReactQuery } from "../../hooks/use-query";
import { formatNumberWithCommas } from "../../utils/formater";

export type Wallet = {
  id: number;
  amount: number;
  date: { jdate: string };
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
        {data?.data.length ? (
          data.data.map((item) => <WalletCard key={item.id} wallet={item} />)
        ) : (
          <NotFound />
        )}
      </div>
    </>
  );
}
