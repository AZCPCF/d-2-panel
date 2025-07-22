import { Mail, MailOpen } from "lucide-react";
import type { Message } from "../../../app/discounts/page";

export default function MessageCard({
  message,
  handleOpenModal,
}: {
  message: Message;
  handleOpenModal: (message: Message) => void;
}) {
  return (
    <div
      key={message.id}
      className={`rounded-lg p-5 shadow-sm transition duration-200 bg-background`}
    >
      <div className="flex justify-between items-start mb-2 gap-2 text-primary-main">
        {message.is_seen ? <MailOpen size={20} /> : <Mail size={20} />}
        <h3 className="font-semibold w-full text-base text-parimary text-primary-main truncate">
          {message.message.text_message}
        </h3>
      </div>

      <div className="flex justify-between items-center gap-2">
        <span className="text-md dark:text-white truncate">
          {message.created_at.string}
        </span>
        <button
          className="text-xs bg-primary-200/75 dark:bg-primary-300 text-primary-700 px-3 py-2  rounded-md hover:bg-primary-200 dark:hover:bg-primary-400 transition cursor-pointer"
          onClick={() => handleOpenModal(message)}
        >
          مشاهده بیشتر
        </button>
      </div>
    </div>
  );
}
