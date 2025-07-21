import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import DatePicker from "../../components/ui/date-picker";
import Divider from "../../components/ui/divider";
import useModal from "../../hooks/use-modal";
import { useReactMutation } from "../../hooks/use-mutation";
import { useReactQuery } from "../../hooks/use-query";
import { birthDateSchema } from "../../validations/birth";
import BirthDateCard from "../../components/pages/birth-dates/card";
import { useState } from "react";

type BirthDateItem = {
  id: number;
  title: string;
  date: { string: string; jdate: string; timestamp: number };
};

type BirthDatesType = {
  data: BirthDateItem[];
};

export default function BirthDatesPage() {
  const { data, refetch } = useReactQuery<BirthDatesType>({
    endpoint: "birthday_reminder",
  });

  const { Modal, modalOpener, modalCloser } = useModal();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const saveMutation = useReactMutation();
  const deleteMutation = useReactMutation();

  const form = useForm({
    defaultValues: { title: "", date: "" },
    validators: { onChange: birthDateSchema },
    onSubmit: async ({ value }) => {
      modalCloser();

      await saveMutation.mutateAsync(
        { endpoint: "birthday_reminder", method: "POST", body: value },
        {
          onSuccess: () => {
            toast.success("یادآور اضافه شد");
            form.reset();
            refetch();
          },
          onError: () => {
            toast.error("افزودن یادآور با خطا مواجه شد");
          },
        }
      );
    },
  });

  const openFormModal = () => {
    form.reset({ title: "", date: "" });
    modalOpener(
      <form
        className="space-y-4 p-4 rounded-xl w-full"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h2 className="text-xl font-semibold mb-2 text-center">
          افزودن یادآور تولد جدید
        </h2>

        <form.Field
          name="title"
          children={(field) => (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">عنوان</label>
              <input
                className="p-2 rounded-lg input bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary-main transition"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="مثال: تولد مادر"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        />

        <form.Field
          name="date"
          children={(field) => (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">تاریخ تولد</label>
              <DatePicker
                onChange={field.handleChange}
                value={field.state.value}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        />

        <button
          type="submit"
          className="bg-primary-main hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-xl w-full transition"
        >
          ذخیره یادآور
        </button>
      </form>
    );
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(
      {
        endpoint: `birthday_reminder/${id}`,
        method: "DELETE",
      },
      {
        onSuccess: () => {
          toast.success("یادآور حذف شد");
          refetch();
          setOpenMenuId(null);
        },
        onError: () => {
          toast.error("خطا در حذف یادآور");
        },
      }
    );
  };

  const handleMenuToggle = (id: number) => {
    setOpenMenuId((current) => (current === id ? null : id));
  };

  return (
    <>
      <Modal />
      <Divider
        title="یادآور تولد"
        button={{
          title: "افزودن یادآور",
          onClick: openFormModal,
        }}
      />

      <div className="grid grid-cols-5 gap-4 mt-6 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {data?.data.map((item) => (
          <BirthDateCard
            key={item.id}
            id={item.id}
            title={item.title}
            date={item.date.string}
            isMenuOpen={openMenuId === item.id}
            onMenuToggle={handleMenuToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
}
