import { useEffect, useState } from "react";
import { useReactQuery } from "../../../hooks/use-query";
import { useReactMutation } from "../../../hooks/use-mutation";
import { Button } from "../../../components/ui/button";
import Divider from "../../../components/ui/divider";
import { cn } from "../../../utils/cn";
import { toast } from "sonner";
import { formatNumberWithCommas } from "../../../utils/formater";

type PostOption = {
  id: number;
  title: string;
  cost: number;
  customer_pay: boolean;
};

type PackagingOption = {
  id: number;
  title: string;
  cost: number;
};

type Address = {
  id: number;
  user_id: number;
  full_name: string;
  phone_number: string;
  title: string;
  province: string;
  city: string;
  postal_code: string;
  text: string;
  for_other: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

type CartCostsResponse = {
  message: string;
  wallet_amount: number;
  after_price: number;
  discount: number;
  total_price: number;
  errors: string[];
  is_empty: boolean;
  post_options: PostOption[];
  packaging_options: PackagingOption[];
  addresses: Address[];
};

export default function SubmitPage() {
  const { data, isLoading, refetch } = useReactQuery<CartCostsResponse>({
    endpoint: "cart_costs",
  });

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedPackagingId, setSelectedPackagingId] = useState<number | null>(
    null
  );
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  const { mutateAsync: checkDiscount, isPending: isChecking } =
    useReactMutation<{
      code: string;
      effect_cost: number;
    }>({
      onSuccess: (res) => {
        if (res.effect_cost) {
          refetch();
          return;
        }
        toast.error("کد تخفیف نامعتبر است");
      },
      onError: () => {
        setAppliedDiscount(0);
        toast.error("کد تخفیف نامعتبر است");
      },
    });

  const { mutateAsync: submitPayment, isPending: isPendingSubmit } =
    useReactMutation<{ link: string }>({
      onSuccess: (res) => {
        window.open(res.link, "_self");
      },
    });

  useEffect(() => {
    if (data?.total_price) {
      setSubtotal(data.total_price);
    }
  }, [data]);

  if (isLoading || !data) return <div>در حال بارگذاری...</div>;

  const { post_options, packaging_options, addresses } = data;

  const selectedPost = post_options.find((p) => p.id === selectedPostId);
  const selectedPackaging = packaging_options.find(
    (p) => p.id === selectedPackagingId
  );

  const postCost = selectedPost
    ? selectedPost.customer_pay
      ? selectedPost.cost
      : 0
    : 0;
  const packagingCost = selectedPackaging ? selectedPackaging.cost : 0;

  const totalBeforeDiscount = subtotal + postCost + packagingCost;
  const finalPrice = totalBeforeDiscount - appliedDiscount;

  return (
    <div className="dark:text-white">
      <Divider title="تکمیل خرید" />
      <div className="grid grid-cols-12 gap-3 max-md:grid-cols-1">
        <div className="col-span-8 max-lg:col-span-7">
          <div className="my-4 bg-background/70 rounded-md p-4 backdrop-blur-md">
            <h3 className="font-semibold text-xl mb-2">روش ارسال</h3>
            <div className="space-y-2 grid grid-cols-4 max-lg:grid-cols-2">
              {post_options.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="post"
                    value={opt.id}
                    checked={selectedPostId === opt.id}
                    onChange={() => setSelectedPostId(opt.id)}
                  />
                  <span>{opt.title}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {opt.customer_pay
                      ? `${formatNumberWithCommas(opt.cost)} تومان`
                      : "رایگان"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="my-4 bg-background/70 rounded-md p-4 backdrop-blur-md">
            <h3 className="font-semibold text-xl mb-2">بسته‌بندی</h3>
            <div className="space-y-2 grid grid-cols-4 max-lg:grid-cols-2">
              {packaging_options.map((pkg) => (
                <label key={pkg.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="packaging"
                    value={pkg.id}
                    checked={selectedPackagingId === pkg.id}
                    onChange={() => setSelectedPackagingId(pkg.id)}
                  />
                  <span>{pkg.title}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {formatNumberWithCommas(pkg.cost)} تومان
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="my-4 bg-background/70 rounded-md p-4 backdrop-blur-md">
            <h3 className="font-semibold text-xl mb-2">آدرس</h3>
            <div className="space-y-4 grid grid-cols-4 gap-2 max-md:grid-cols-2 max-lg:grid-cols-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={cn(
                    "block border p-3 rounded h-max duration-100",
                    selectedAddressId === addr.id
                      ? "border-blue-500 shadow-md"
                      : "border-gray-300"
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mr-2"
                  />
                  <div className="text-sm">
                    <div className="font-medium">{addr.full_name}</div>
                    <div>{addr.phone_number}</div>
                    <div>{addr.text}</div>
                    <div>کد پستی: {addr.postal_code}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-background/70 max-lg:col-span-5 max-md:col-span-full backdrop-blur-md rounded-md p-4 my-4 h-max">
          <h2 className="text-xl font-bold mb-4">جزئیات سفارش</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="کد تخفیف"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <Button
              onClick={async () =>
                await checkDiscount({
                  endpoint: "check_discount",
                  body: { code: couponCode },
                })
              }
              disabled={isChecking}
            >
              {isChecking ? "در حال بررسی..." : "اعمال"}
            </Button>
          </div>

          <div className="space-y-2 text-base">
            <div>قیمت کالاها: {formatNumberWithCommas(subtotal)} تومان</div>
            <div>هزینه ارسال: {formatNumberWithCommas(postCost)} تومان</div>
            <div>
              هزینه بسته‌بندی: {formatNumberWithCommas(packagingCost)} تومان
            </div>
            <div>تخفیف: {formatNumberWithCommas(appliedDiscount)} تومان</div>
            <div className="font-semibold">
              مبلغ نهایی: {formatNumberWithCommas(finalPrice)} تومان
            </div>
          </div>

          <Divider title />

          <Button
            onClick={async () => {
              await submitPayment({
                endpoint: "payment",
                body: { amount: finalPrice },
              });
            }}
            disabled={
              !selectedPostId ||
              !selectedPackagingId ||
              !selectedAddressId ||
              isPendingSubmit
            }
            className="w-full mt-4 dark:disabled:!bg-gray-600 disabled:!bg-gray-300"
          >
            {isPendingSubmit ? "در حال پردازش..." : "ثبت سفارش"}
          </Button>
        </div>
      </div>
    </div>
  );
}
