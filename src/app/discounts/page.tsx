import { useState } from "react";
import MessageCard from "../../components/pages/messages/card";
import Divider from "../../components/ui/divider";
import useModal from "../../hooks/use-modal";

export type Message = {
  id: number;
  title: string;
  description: string;
  is_seen: boolean;
  date: { jdate: string };
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    title: "کد تخفیف ویژه عید قربان",
    description: "۳۰٪ تخفیف برای تمامی محصولات زنانه تا پایان روز عید قربان.",
    is_seen: false,
    date: { jdate: "1404/4/10" },
  },
  {
    id: 2,
    title: "پیشنهاد شگفت‌انگیز امروز",
    description: "تا ۵۰٪ تخفیف بر روی کفش‌های ورزشی فقط امروز!",
    is_seen: true,
    date: { jdate: "1404/4/9" },
  },
  {
    id: 3,
    title: "تخفیف تابستانه آغاز شد",
    description:
      "در جشنواره تابستانه، محصولات مردانه با قیمت‌های ویژه عرضه می‌شوند.",
    is_seen: false,
    date: { jdate: "1404/4/5" },
  },
  {
    id: 4,
    title: "ارسال رایگان با خرید بالای ۵۰۰ هزار تومان",
    description:
      "هزینه ارسال برای سفارش‌های بالای ۵۰۰ هزار تومان کاملاً رایگان است.",
    is_seen: false,
    date: { jdate: "1404/4/3" },
  },
  {
    id: 5,
    title: "تخفیف روی کیف و اکسسوری",
    description:
      "۲۰٪ تخفیف روی کیف‌های دستی زنانه و اکسسوری‌های منتخب تا پایان هفته.",
    is_seen: true,
    date: { jdate: "1404/3/28" },
  },
];

export default function DiscountsPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const { Modal, modalOpener } = useModal();

  const handleOpenModal = (message: Message) => {
    if (!message.is_seen) {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, is_seen: true } : m))
      );
    }

    modalOpener(
      <div className="space-y-2 p-2">
        <h2 className="text-xl font-semibold text-primary-main">
          {message.title}
        </h2>
        <p className="text-gray-600 dark:!text-gray-200 text-sm">
          {message.description}
        </p>
        <p className="text-md text-gray-400 dark:text-gray-200 text-end">
          {message.date.jdate}
        </p>
      </div>
    );
  };

  return (
    <>
      <Modal />
      <Divider title="تخفیف ها" />
      <div className="grid grid-cols-5 gap-4 mt-6 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {messages.map((message) => (
          <MessageCard handleOpenModal={handleOpenModal} message={message} />
        ))}
      </div>
    </>
  );
}
