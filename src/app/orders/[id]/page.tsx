import { useParams } from "@tanstack/react-router";
import { useReactQuery } from "../../../hooks/use-query";
import { formatNumberWithCommas } from "../../../utils/formater";
import Divider from "../../../components/ui/divider";
import NotFound from "../../../components/ui/not-found";

type OrderStatus =
  | "pending_payment"
  | "pending_approval"
  | "preparing"
  | "shipped"
  | "canceled";

const statusMap: Record<OrderStatus, string> = {
  pending_payment: "درانتظار پرداخت",
  pending_approval: "درانتظارتایید",
  preparing: "درحال اماده سازی",
  shipped: "تحویل به پست",
  canceled: "لغو شده",
};

type OrderDetail = {
  id: number;
  status: OrderStatus;
  created_at: string;
  total_price: number;
  discount: number;
  final_price: number;
  items: {
    id: number;
    title: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  address: {
    full_name: string;
    phone_number: string;
    text: string;
    postal_code: string;
  };
};

export default function OrderDetailPage() {
  const { id } = useParams({ from: "" });

  const { data, isLoading } = useReactQuery<{ order: OrderDetail }>({
    endpoint: `orders/${id}`,
  });

  if (isLoading) return <div className="p-4">در حال بارگذاری...</div>;
  if (!data?.order) return <NotFound title="سفارش" />;

  const { order } = data;

  return (
    <div className="p-4 dark:text-white">
      <Divider title={`سفارش #${order.id}`} />

      <div className="text-sm text-gray-500 mb-4">
        تاریخ ثبت: {new Date(order.created_at).toLocaleDateString("fa-IR")} |
        وضعیت:{" "}
        <span className="text-black dark:text-white font-semibold">
          {statusMap[order.status]}
        </span>
      </div>

      <Divider title="محصولات" />
      <div className="space-y-2 mb-6">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="flex items-center gap-2">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">
                  تعداد: {item.quantity}
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold">
              {formatNumberWithCommas(item.price * item.quantity)} تومان
            </div>
          </div>
        ))}
      </div>

      <Divider title="آدرس دریافت" />
      <div className="text-sm bg-background/70 p-3 rounded mb-6">
        <div>{order.address.full_name}</div>
        <div>{order.address.phone_number}</div>
        <div>{order.address.text}</div>
        <div>کد پستی: {order.address.postal_code}</div>
      </div>

      <Divider title="مبالغ" />
      <div className="text-sm space-y-1">
        <div>
          مبلغ کالاها: {formatNumberWithCommas(order.total_price)} تومان
        </div>
        <div>تخفیف: {formatNumberWithCommas(order.discount)} تومان</div>
        <div className="font-semibold">
          مبلغ نهایی: {formatNumberWithCommas(order.final_price)} تومان
        </div>
      </div>
    </div>
  );
}
