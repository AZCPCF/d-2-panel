import { useParams } from "@tanstack/react-router";
import { Check, CheckCheck, Shield, User } from "lucide-react";
import { Badge } from "../../../components/pages/profile/badge";
import TicketMessageModal from "../../../components/pages/ticket/message-modal";
import Divider from "../../../components/ui/divider";
import useModal from "../../../hooks/use-modal";
import { useReactQuery } from "../../../hooks/use-query";
import { cn } from "../../../utils/cn";
import { fileUrl } from "../../../utils/env";

// Types
type TicketAnswer = {
  id: number;
  ticket_id: number;
  message: string;
  file: string | null;
  sender: "Customer" | "Admin";
  user_is_seen: boolean;
  admin_is_seen: boolean;
  created_at: {
    jdate: string;
    string: string;
  };
};

type Ticket = {
  id: number;
  user_id: number;
  title: string;
  is_active: boolean;
  user_is_seen: boolean;
  admin_is_seen: boolean;
  created_at: {
    string: string;
  };
  updated_at: {
    string: string;
  };
  answers: TicketAnswer[];
};

type TicketResponse = {
  message: string;
  data: Ticket;
};

export default function TicketPage() {
  const { id } = useParams({ from: "/tickets/$id" });
  const { data, refetch } = useReactQuery<TicketResponse>({
    endpoint: `ticket/${id}`,
  });


  const { Modal, modalCloser, modalOpener } = useModal();

  if (!data) return <p>در حال بارگذاری...</p>;

  const ticket = data.data;

  return (
    <div className="mx-auto p-3">
      {/* Modal for sending a new message */}
      <Modal />

      {/* Header */}
      <Divider
        title={
          <>
            <p className="text-2xl font-bold">تیکت #{ticket.id}</p>
            <div className="text-sm text-muted-foreground">
              {ticket.created_at.string}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className={
                  ticket.is_active
                    ? "text-green-600 dark:bg-gray-300 border-green-600"
                    : "text-red-500 border-red-500"
                }
              >
                {ticket.is_active ? "فعال" : "بسته شده"}
              </Badge>
            </div>
          </>
        }
        button={{
          title: "پیام",
          onClick: () => {
            modalOpener(
              <TicketMessageModal
                ticket_id={id}
                closeModal={() => {
                  modalCloser();
                  refetch();
                }}
              />
            );
          },
        }}
      />
      {/* Chat Container */}
      <div className="bg-background p-4 rounded-lg shadow-md min-h-[60vh] space-y-4 mt-8">
        <div className="text-2xl dark:text-white">{ticket.title}</div>
        {ticket.answers.map((answer) => {
          const isCustomer = answer.sender === "Customer";
          const isSeen = isCustomer
            ? answer.admin_is_seen
            : answer.user_is_seen;

          return (
            <div
              key={answer.id}
              className={cn(
                "flex gap-3 items-end",
                isCustomer ? "justify-start" : "justify-end"
              )}
            >
              {isCustomer && (
                <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-400 rounded-full p-2">
                  <User size={20} />
                </div>
              )}

              <div
                className={cn(
                  "relative max-md:max-w-[250px] max-w-[360px] max-[400px]:!max-w-[230px] min-w-[230px] p-3 rounded-lg text-sm shadow-md",
                  isCustomer
                    ? "bg-white dark:bg-gray-600 border border-primary-main dark:text-white text-black"
                    : "bg-primary text-white"
                )}
              >
                <div className="mb-1 text-xs opacity-70 flex justify-between gap-4">
                  <span className="text-lg text-primary-main">
                    {isCustomer ? "شما" : "پشتیبانی"}
                  </span>
                </div>
                <div className="break-words whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {answer.message}
                </div>

                {answer.file && (
                  <a
                    href={`${fileUrl}${answer.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-100 underline text-xs"
                  >
                    مشاهده فایل
                  </a>
                )}

                <div className="flex justify-end gap-4 text-primary-main mt-2">
                  <span className="text-base">{answer.created_at.jdate}</span>
                  {isSeen ? <CheckCheck size={20} /> : <Check size={20} />}
                </div>
              </div>

              {!isCustomer && (
                <div className="flex-shrink-0 bg-primary text-white rounded-full p-2">
                  <Shield size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
