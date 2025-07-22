import { Info, LoaderCircle, Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import Divider from "../../components/ui/divider";
import { useReactMutation } from "../../hooks/use-mutation";
import { useReactQuery } from "../../hooks/use-query";
import { fileUrl } from "../../utils/env";
import { formatNumberWithCommas } from "../../utils/formater";
import { Link } from "@tanstack/react-router";
import NotFound from "../../components/ui/not-found";

type CartResponse = {
  product: {
    id: number;
    stock_id: number;
    count: number;
    stock: {
      stock: number;
      color: { title: string; color: string };
      size: { title: string };
      product: {
        title: string;
        image_1: { url: string; alt: string };
        price: string;
        after_price: string;
        discount: number;
      };
    };
  }[];
  total_price: number;
};

export default function CartPage() {
  const { data, refetch } = useReactQuery<CartResponse>({ endpoint: "cart" });
  const { mutateAsync } = useReactMutation({ onSuccess: refetch });

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const actiodsn = async (body: { count: number; stock_id: number }) => {
    setLoadingId(body.stock_id);
    await mutateAsync({
      endpoint: "cart",
      method: "POST",
      body,
    });
    setLoadingId(0);
  };

  return (
    <>
      <Divider title="سبد خرید" />
      {data?.product.length ? (
        <div className="grid grid-cols-12 gap-6 mt-4">
          {/* Cart Items */}
          <div className="col-span-12 lg:col-span-9 grid gap-3 grid-cols-2 max-md:grid-cols-1 dark:text-white">
            {data.product.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap gap-3 items-center rounded-lg shadow-sm bg-background/70 backdrop-blur-md h-max"
              >
                <img
                  src={`${fileUrl}${item.stock.product.image_1.url}`}
                  alt={item.stock.product.image_1.alt}
                  className="w-24 h-full object-cover rounded-tr-md"
                />
                <div className="flex-1 space-y-1 p-0 truncate">
                  <h3 className="font-semibold text-lg truncate">
                    {item.stock.product.title} {item.stock.product.title}
                  </h3>
                  <div className="text-sm flex items-center gap-1">
                    رنگ:{" "}
                    <span
                      className="inline-block w-4 h-4 rounded-full mr-1 border"
                      style={{ backgroundColor: item.stock.color.color }}
                    ></span>
                    {item.stock.color.title} | سایز: {item.stock.size.title}
                  </div>
                </div>

                <div className="text-sm flex justify-end w-full items-center gap-2 mb-4 px-4">
                  <div className="text-end px-4">
                    {item.stock.product.after_price !==
                    item.stock.product.price ? (
                      <>
                        <p className="text-red-500 font-bold">
                          {formatNumberWithCommas(
                            item.stock.product.after_price
                          )}{" "}
                          تومان
                        </p>
                        <p className="text-sm line-through">
                          {formatNumberWithCommas(item.stock.product.price)}{" "}
                          تومان
                        </p>
                      </>
                    ) : (
                      <p className="font-bold">
                        {formatNumberWithCommas(item.stock.product.price)} تومان
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      actiodsn({
                        count: item.count - 1,
                        stock_id: item.stock_id,
                      })
                    }
                    disabled={loadingId === item.stock_id}
                    className="disabled:!cursor-not-allowed"
                  >
                    {item.count == 1 ? (
                      <Trash className="w-4 h-4 text-red-500" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                  </Button>
                  <span className="px-2">
                    {loadingId == item.stock_id ? (
                      <LoaderCircle className="animate-spin text-primary-main" />
                    ) : (
                      item.count
                    )}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      actiodsn({
                        count: item.count + 1,
                        stock_id: item.stock_id,
                      })
                    }
                    className="disabled:!cursor-not-allowed"
                    disabled={
                      item.count >= item.stock.stock ||
                      loadingId === item.stock_id
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="col-span-12 sticky top-4 lg:col-span-3 w-full max-h-56 min-h-40 h-max flex flex-col bg-background/70 backdrop-blur-md p-4 rounded-lg space-y-4 shadow">
            <p className="text-lg font-medium dark:text-white">
              جمع سبد خرید:{" "}
              <span className="font-bold text-primary-main">
                {formatNumberWithCommas(data.total_price)} تومان
              </span>
            </p>
            <span className="text-gray-600 dark:text-white flex gap-2 items-center">
              <Info size={18} />
              برای تکمیل خرید , انتخاب آدرس و اعمال کد تخفیف روی دکمه زیر کلیک
              کنید.
            </span>
            <Link
              to="submit"
              className="px-4 py-2 rounded-md font-medium transition-all border border-transparent text-lg bg-primary-main !text-white text-center hover:bg-primary-600"
            >
              تکمیل خرید
            </Link>
          </div>
        </div>
      ) : (
        <NotFound title="محصولی" />
      )}
    </>
  );
}
