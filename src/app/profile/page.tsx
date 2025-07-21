import { Copy, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import Divider from "../../components/ui/divider";
import useModal from "../../hooks/use-modal";
import { useReactMutation } from "../../hooks/use-mutation";
import { useReactQuery } from "../../hooks/use-query";

type Customer = {
  id: number;
  full_name: string | null;
  phone_number: string;
  birth_date: string | null;
  is_block: boolean;
  block_reason: string | null;
  wallet_amount: number;
  referral: string | null;
  status: "pending" | "active" | "inactive" | string;
  created_at: string;
  updated_at: string;
  ref: string;
};

type CustomerResponse = {
  type: "Customer";
  data: Customer;
  score: string;
};

export default function ProfilePage() {
  const { data, refetch } = useReactQuery<CustomerResponse>({
    endpoint: "user_info",
    apiUrl: "secondary",
  });

  const customer = data?.data;

  const { mutateAsync, isPending } = useReactMutation();

  const handleCopy = async () => {
    if (customer?.ref) {
      await navigator.clipboard.writeText(customer.ref);
      toast.success("کد دعوت کپی شد");
    }
  };

  const { Modal, modalOpener, modalCloser } = useModal();
  const [value, setValue] = useState("");
  useEffect(() => {
    if (value != customer?.full_name) {
      setValue(customer?.full_name || "");
    }
  }, [customer, value]);
  const openEditModal = () => {
    modalOpener(
      <EditNameModal
        initialName={customer?.full_name || ""}
        isPending={isPending}
        onSave={async (name: string) => {
          await mutateAsync(
            {
              method: "PUT",
              endpoint: "user",
              body: { full_name: name },
            },
            {
              onSuccess: () => {
                toast.success("ویرایش با موفقیت انجام شد");
                refetch();
              },
              onError: () => {
                toast.error("ویرایش با خطا مواجه شد");
              },
              onSettled: () => {
                modalCloser();
              },
            }
          );
        }}
      />
    );
  };

  return (
    <div className="mx-auto p-2 space-y-6">
      <Modal />
      <Divider title="مشخصات کاربر" />
      <div className="space-y-4 bg-background gap-3 rounded-lg p-4 grid grid-cols-4 !place-content-center max-lg:grid-cols-2 max-sm:grid-cols-1 dark:text-white">
        <div className="flex gap-2 items-center !mb-0">
          <InfoRow
            label="نام و نام خانوادگی"
            value={customer?.full_name || "-"}
          />
          <button
            className="bg-primary-200 rounded-full p-2 hover:bg-primary-300 duration-100"
            onClick={openEditModal}
          >
            <Edit size={16} />
          </button>
        </div>
        <InfoRow label="شماره تماس" value={customer?.phone_number} />
        <InfoRow
          label="امتیاز باشگاه مشتریان"
          value={Number(data?.score).toLocaleString()}
        />
        <div className="flex items-center gap-2">
          <span className="text-lg text-muted-foreground">کد دعوت شما</span>
          <span> : </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-primary-main">
              {customer?.ref || "-"}
            </span>
            <Button variant="outline" onClick={handleCopy} className="px-2">
              <Copy className="w-4 h-4 text-primary-main" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="text-nowrap truncate !mb-0">
      <span className="text-lg text-muted-foreground">{label}</span>
      <span> : </span>
      <span className="text-lg font-medium text-primary-main">{value}</span>
    </div>
  );
}
function EditNameModal({
  initialName,
  onSave,
  isPending,
}: {
  initialName: string;
  onSave: (name: string) => void;
  isPending: boolean;
}) {
  const [value, setValue] = useState(initialName);

  const handleSubmit = () => {
    if (!value.trim()) {
      toast.error("نام نمی‌تواند خالی باشد");
      return;
    }
    if (value == initialName) {
      toast.error("نام باید تغییر کند");
      return;
    }
    onSave(value);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">ویرایش نام</h2>
      <input
        className="input w-full border p-2 rounded"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="نام و نام خانوادگی"
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isPending}>
          ذخیره
        </Button>
      </div>
    </div>
  );
}
