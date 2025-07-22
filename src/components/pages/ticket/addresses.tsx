import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import type { TicketContactResopnse } from "../../../app/tickets/page";
import Instagram from "../../../assets/icons/instagram";
import Telegram from "../../../assets/icons/telegram";
import Whatsapp from "../../../assets/icons/whats-app";
import { cn } from "../../../utils/cn";

const AboutCard = ({
  children,
  className,
  to,
  target = "_blank",
}: {
  children: ReactNode;
  to: string;
  target?: "_self" | "_blank";
  className?: string;
}) => (
  <Link
    to={to}
    target={target}
    className={cn(
      "bg-background rounded-lg p-3 flex items-center gap-2 shadow-sm hover:shadow-md duration-200 !text-black dark:!text-white",
      className
    )}
  >
    {children}
  </Link>
);
export default function TicketAddresses({ data }: { data?: TicketContactResopnse }) {
  return (
    <div className="grid grid-cols-3 mt-4 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1 mb-10">
      <AboutCard
        to={`https://api.whatsapp.com/send/?phone=${data?.whatsapp}&text&type=phone_number&app_absent=0`}
      >
        <div className="bg-primary-200 dark:bg-primary-300 p-3 rounded-md">
          <Whatsapp />
        </div>
        {data?.whatsapp}
      </AboutCard>
      <AboutCard to={`https://t.me/${data?.telegram}`}>
        <div className="bg-primary-200 dark:bg-primary-300 p-3 rounded-md">
          <Telegram />
        </div>
        {data?.telegram}
      </AboutCard>

      <AboutCard to={`tel:${data?.phone_number}`}>
        <div className="bg-primary-200 dark:bg-primary-300 p-3 rounded-md">
          <Phone className="text-primary-700" />
        </div>
        {data?.phone_number}
      </AboutCard>

      <AboutCard to={`tel:${data?.phone_number2}`}>
        <div className="bg-primary-200 dark:bg-primary-300 p-3 rounded-md">
          <Phone className="text-primary-700" />
        </div>
        {data?.phone_number2}
      </AboutCard>

      <AboutCard to={`https://www.instagram.com/${data?.instagram}`}>
        <div className="bg-primary-200 dark:bg-primary-300 p-3 rounded-md">
          <Instagram />
        </div>
        {data?.instagram}
      </AboutCard>

      <AboutCard to={`mailto:${data?.email}`}>
        <div className="bg-primary-200 dark:bg-primary-300 p-3 rounded-md">
          <Mail className="text-primary-700" />
        </div>
        {data?.email}
      </AboutCard>
      <AboutCard to="#" className="col-span-full" target="_self">
        <div className="bg-primary-200 dark:bg-primary-300 p-3 rounded-md">
          <MapPin className="text-primary-700" />
        </div>
        {data?.address}
      </AboutCard>
    </div>
  );
}
