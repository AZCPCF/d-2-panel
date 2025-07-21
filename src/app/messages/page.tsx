import { useState } from "react";
import MessageCard from "../../components/pages/messages/card";
import Divider from "../../components/ui/divider";
import useModal from "../../hooks/use-modal";
import type { Message } from "../discounts/page";

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    title: "سفارش جدید ثبت شد",
    description: "سفارش شماره ۲۵۳۴ شامل ۳ محصول لباس مردانه با موفقیت ثبت شد.",
    is_seen: false,
    date: { jdate: "1404/4/15" },
  },
  {
    id: 2,
    title: "تخفیف جدید برای تابستان!",
    description: "۲۰٪ تخفیف برای پیراهن‌های مردانه تا پایان هفته اعمال شد.",
    is_seen: true,
    date: { jdate: "1404/4/12" },
  },
  {
    id: 3,
    title: "لغو سفارش",
    description: "سفارش شماره ۲۴۸۷ به درخواست مشتری لغو شد.",
    is_seen: false,
    date: { jdate: "1404/3/29" },
  },
  {
    id: 4,
    title: "محصول جدید اضافه شد",
    description: "کت مردانه کلاسیک به دسته‌بندی پوشاک زمستانی اضافه شد.",
    is_seen: true,
    date: { jdate: "1404/2/20" },
  },
  {
    id: 5,
    title: "بروزرسانی وضعیت انبار",
    description: "موجودی محصولات تابستانی بروز شد. لطفا بررسی نمایید.",
    is_seen: true,
    date: { jdate: "1404/1/5" },
  },
];

export default function MessagesPage() {
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
        <h2 className="text-xl font-semibold text-primary-main">{message.title}</h2>
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
      <Divider title="پیام‌ها" />
      <div className="grid grid-cols-5 gap-4 mt-6 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {messages.map((message) => (
          <MessageCard message={message} handleOpenModal={handleOpenModal} />
        ))}
      </div>
    </>
  );
}
