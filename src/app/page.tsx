import { Link } from "@tanstack/react-router";
import { routes } from "../data/routes";
import { useClient } from "../context/client-context";
import { cn } from "../utils/cn";

export default function HomePage() {
  const stats = useClient();
  return (
    <div className="grid grid-cols-8 max-xl:grid-cols-6 max-md:grid-cols-4 max-sm:grid-cols-3 gap-4 max-lg:gap-2 max-sm:gap-1.5">
      {routes.map((item, index) => (
        <Link
          to={item.route}
          className="shadow-md w-full aspect-square flex justify-center items-center hover:scale-105 duration-100 bg-background rounded-xl"
          key={index}
        >
          <div
            className={cn(
              "text-primary-main flex justify-center items-center flex-wrap text-2xl max-lg:text-lg gap-1.5",
              item.statsKey
                ? +stats[item.statsKey]
                  ? "stats before:!right-6 max-lg:before:!right-4"
                  : ""
                : ""
            )}
            {...(item.statsKey
              ? { "data-stats": stats[item.statsKey] }
              : undefined)}
          >
            <item.icon size={36} className="w-full" />
            <p className="w-max">{item.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
