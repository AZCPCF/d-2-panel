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
      className={`rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200 cursor-pointer bg-background`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-base text-primary truncate text-primary-main flex items-center gap-2">
          {message.is_seen ? <MailOpen /> : <Mail />}
          {message.title}
        </h3>
        <span className="text-md dark:text-white truncate">
          {message.date.jdate}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-100 mb-3 truncate">
        {message.description}
      </p>

      <div className="flex justify-end items-center gap-2">
        <button
          className="text-xs bg-primary-200/75 text-primary-700 px-3 py-1 rounded-md hover:bg-primary-200 transition"
          onClick={() => handleOpenModal(message)}
        >
          مشاهده بیشتر
        </button>
      </div>
    </div>
  );
}
