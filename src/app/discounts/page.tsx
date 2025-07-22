import { useState } from "react";
import MessageCard from "../../components/pages/messages/card";
import Divider from "../../components/ui/divider";
import useModal from "../../hooks/use-modal";
import { useReactQuery } from "../../hooks/use-query";
import NotFound from "../../components/ui/not-found";

export type Message = {
  id: number;
  title: string;
  description: string;
  is_seen: boolean;
  message: { text_message: string };
  created_at: { jdate: string; string: string };
};

export default function DiscountsPage() {
  const { data: messages, refetch } = useReactQuery<{ data: Message[] }>({
    endpoint: "message_discount",
  });
  const [id, setId] = useState(0);
  const { data } = useReactQuery(
    { endpoint: `message/${id}` },
    { enabled: Boolean(id) }
  );
  console.log(data);
  const { Modal, modalOpener } = useModal();

  const handleOpenModal = (message: Message) => {
    if (!message.is_seen) {
      setId(message.id);
      refetch();
    }

    modalOpener(
      <div className="space-y-2 p-2">
        <h2 className="text-lg font-semibold !text-gray-600 dark:!text-white border-b-2 border-primary-main">
          {message.message.text_message}
        </h2>
        <p className="text-md text-gray-400 dark:text-gray-200 text-end">
          {message.created_at.string}
        </p>
      </div>
    );
  };

  return (
    <>
      <Modal />
      <Divider title="تخفیف ها" />
      <div className="grid grid-cols-4 gap-4 mt-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {messages?.data.length ? (
          messages?.data.map((message) => (
            <MessageCard
              key={message.id}
              handleOpenModal={handleOpenModal}
              message={message}
            />
          ))
        ) : (
          <NotFound title="کد تخفیفی" />
        )}
      </div>
    </>
  );
}
