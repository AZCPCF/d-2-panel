import { Link } from "@tanstack/react-router";
import { routes } from "../data/routes";

export default function HomePage() {
  return (
    <div className="grid grid-cols-8 max-xl:grid-cols-6 max-md:grid-cols-4 max-sm:grid-cols-3 gap-4 max-lg:gap-2 max-sm:gap-1.5">
      {routes.map((item, index) => (
        <Link
          to={item.route}
          className="shadow-md w-full aspect-square flex justify-center items-center hover:scale-105 duration-100 bg-background rounded-lg"
          key={index}
        >
          <div className="text-primary-main flex justify-center items-center flex-wrap text-2xl max-lg:text-lg gap-1.5">
            <item.icon className="w-full !text-3xl max-sm:!text-2xl" />
            <p className="w-max">{item.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
