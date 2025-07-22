import { useState } from "react";
import { useReactQuery } from "../../hooks/use-query";
import { cn } from "../../utils/cn";
import Divider from "../../components/ui/divider";
import { Link } from "lucide-react";
import NotFound from "../../components/ui/not-found";

type OrderStatus =
  | "pending_payment"
  | "pending_approval"
  | "preparing"
  | "shipped"
  | "canceled";

type Order = {
  id: number;
  status: OrderStatus;
  created_at: string;
  total_price: number;
  items: {
    title: string;
    quantity: number;
  }[];
};

const statusMap: Record<OrderStatus, string> = {
  pending_payment: "درانتظار پرداخت",
  pending_approval: "درانتظارتایید",
  preparing: "درحال اماده سازی",
  shipped: "تحویل به پست",
  canceled: "لغو شده",
};

export default function OrdersPage() {
  const { data, isLoading } = useReactQuery<{ orders: Order[] }>({
    endpoint: "orders",
  });

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all"
  );

  const filteredOrders =
    selectedStatus === "all"
      ? data?.orders || []
      : (data?.orders || []).filter((order) => order.status === selectedStatus);

  return (
    <div className="dark:text-white">
      <Divider title="سفارشات" />

      <div className="grid  grid-cols-6 gap-3 my-4 bg-background/70 rounded-md p-4 backdrop-blur-md">
        <FilterButton
          label="همه"
          active={selectedStatus === "all"}
          onClick={() => setSelectedStatus("all")}
        />
        {Object.entries(statusMap).map(([key, label]) => (
          <FilterButton
            key={key}
            label={label}
            active={selectedStatus === key}
            onClick={() => setSelectedStatus(key as OrderStatus)}
          />
        ))}
      </div>

      {isLoading ? (
        <div>در حال بارگذاری...</div>
      ) : !filteredOrders.length ? (
        <NotFound title="سفارشی" />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link
              to={`${order.id}`}
              key={order.id}
              className="border !text-black dark:!text-white p-4 rounded shadow-sm bg-background/70 backdrop-blur-md"
            >
              <div className="flex justify-between items-center mb-2 text-sm">
                <div>کد سفارش: {order.id}</div>
                <div>
                  {new Date(order.created_at).toLocaleDateString("fa-IR")}
                </div>
              </div>
              <div className="mb-2 text-sm text-gray-500">
                وضعیت:{" "}
                <span className="text-black dark:text-white">
                  {statusMap[order.status]}
                </span>
              </div>
              <div className="text-sm">
                <ul className="list-disc pl-4">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.title} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2 text-sm font-semibold">
                مبلغ کل: {order.total_price.toLocaleString()} تومان
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded border text-sm duration-200",
        active
          ? "bg-primary-main text-white border-primary-main"
          : "border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
    >
      {label}
    </button>
  );
}
