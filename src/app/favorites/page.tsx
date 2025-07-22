import { Ellipsis, HeartMinus } from "lucide-react";
import { useEffect, useState } from "react";
import Divider from "../../components/ui/divider";
import { useReactQuery } from "../../hooks/use-query";
import { fileUrl } from "../../utils/env";
import { formatNumberWithCommas } from "../../utils/formater";
import NotFound from "../../components/ui/not-found";

type FavoriteItem = {
  id: number;
  title: string;
  after_price: number | string;
  image_1: { alt: string; url: string };
};

export default function FavoritesPage() {
  const { data, refetch } = useReactQuery<{
    data: FavoriteItem[];
  }>({ endpoint: "favorites" });
  const [defId, setId] = useState(0);
  const { isSuccess } = useReactQuery(
    { endpoint: `favorite/${defId}` },
    { enabled: Boolean(defId) }
  );
  useEffect(() => {
    if (isSuccess && defId != 0) {
      setId(0);
      refetch();
    }
  }, [isSuccess, defId, refetch]);

  return (
    <>
      <Divider title="علاقه‌مندی‌ها" />
      <div className="grid grid-cols-5 gap-6 mt-6 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2">
        {data?.data.length ? (
          data?.data.map(({ id, title, after_price, image_1 }) => (
            <div
              key={id}
              className="flex flex-col rounded-lg shadow-md overflow-hidden hover:shadow-lg transition bg-background relative"
            >
              <button
                onClick={() => {
                  setId(id);
                }}
                className="p-2 rounded-full absolute left-2 top-2 bg-red-100 duration-100 text-red-500 hover:bg-red-200"
                aria-label={`حذف ${title} از علاقه‌مندی‌ها`}
              >
                {defId == id ? <Ellipsis /> : <HeartMinus />}
              </button>
              <img
                src={`${fileUrl}${image_1.url}`}
                alt={image_1.alt}
                className="w-full aspect-square"
                loading="lazy"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white max-sm:text-base truncate">
                  {title}
                </h3>
                <p className="text-primary-main font-bold text-xl flex justify-end max-sm:text-base">
                  {formatNumberWithCommas(after_price)} تومان
                </p>
              </div>
            </div>
          ))
        ) : (
          <NotFound title="محصولی" />
        )}
      </div>
    </>
  );
}
