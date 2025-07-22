import { Lock } from "lucide-react";
import TicketAddresses from "../../components/pages/ticket/addresses";
import TicketModal from "../../components/pages/ticket/modal";
import Divider from "../../components/ui/divider";
import useModal from "../../hooks/use-modal";
import { useReactQuery } from "../../hooks/use-query";
import TicketWrapper from "../../components/pages/ticket/wrapper";
export type TicketContactResopnse = {
  telegram: string;
  phone_number: string;
  phone_number2: string;
  instagram: string;
  whatsapp: string;
  address: string;
  email: string;
};
export type TicketResopnse = {
  id: number;
  user_id: number;
  title: string;
  user_is_seen: boolean;
  admin_is_seen: boolean;
  created_at: { string: string };
};
export default function TicketsPage() {
  const { data: tickets } = useReactQuery<{
    contact: TicketContactResopnse;
    data: TicketResopnse[];
    not_active: TicketResopnse[];
  }>({
    endpoint: "ticket",
  });
  const { Modal, modalOpener, modalCloser } = useModal();
  return (
    <>
      <Modal />
      <Divider
        title="تیکت پشتیبانی"
        button={{
          title: "تیکت",
          onClick: () => {
            modalOpener(<TicketModal closeModal={modalCloser} />);
          },
        }}
      />
      <TicketAddresses data={tickets?.contact} />
      <TicketWrapper title="تیکت ها" data={tickets?.data} />
      <TicketWrapper
        data={tickets?.not_active}
        title={
          <div className="flex gap-2 items-center">
            <Lock size={20} />
            تیکت های بسته شده
          </div>
        }
      />
    </>
  );
}
