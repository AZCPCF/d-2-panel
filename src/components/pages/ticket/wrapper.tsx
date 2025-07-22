import { Check, CheckCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { TicketResopnse } from "../../../app/tickets/page";
import { cn } from "../../../utils/cn";
import Divider from "../../ui/divider";
import { Link } from "@tanstack/react-router";
import NotFound from "../../ui/not-found";

export default function TicketWrapper({
  title,
  data,
}: {
  title: ReactNode;
  data?: TicketResopnse[];
}) {
  if (!data || !data.length) {
    return (
      <div className="mb-6">
        <Divider title={title} />
        <NotFound title="تیکتی" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Divider title={title} />
      <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4 mt-4">
        {data.map((ticket) => (
          <Link
            to={`${ticket.id}`}
            key={ticket.id}
            className={cn(
              "p-4 rounded-lg !text-black shadow-sm transition hover:shadow-md bg-background backdrop-blur-md dark:!text-white  relative hover:scale-[104%] "
            )}
          >
            {!ticket.user_is_seen && (
              <span className="absolute top-2 left-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                جدید
              </span>
            )}

            <div className="flex items-center mb-2 gap-2">
              <div className="bg-primary-100 text-primary-600 dark:bg-primary-200 p-2 rounded-full">
                {ticket.admin_is_seen ? (
                  <CheckCheck size={20} />
                ) : (
                  <Check size={20} />
                )}
              </div>
              <h3 className="font-semibold text-lg truncate">{ticket.title}</h3>
            </div>

            <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-300 gap-2">
              <span>{ticket.created_at.string}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
