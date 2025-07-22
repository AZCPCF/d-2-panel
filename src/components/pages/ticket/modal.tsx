import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useReactMutation } from "../../../hooks/use-mutation";
import { TicketSchema } from "../../../validations/ticket";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/button";
import toFormData from "../../../utils/to-form-data";

// ✅ Helper to convert values to FormData

export default function TicketModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const { mutateAsync } = useReactMutation();

  const form = useForm({
    defaultValues: {
      title: "",
      question: "",
      file: null as File | null,
    },
    validators: { onChange: TicketSchema },
    onSubmit: async ({ value }) => {
      await mutateAsync(
        {
          endpoint: "ticket",
          body: toFormData(value),
        },
        {
          onSuccess: () => {
            toast.success("تیکت با موفقیت ثبت شد.");
          },
          onSettled: () => {
            closeModal();
          },
        }
      );
    },
  });

  return (
    <div className="p-3">
      <h2 className="text-2xl">ثبت تیکت پشتیبانی</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="grid grid-cols-1 mt-3 gap-3"
        encType="multipart/form-data"
      >
        <form.Field
          name="title"
          children={(field) => (
            <div>
              <label>عنوان</label>
              <Input
                placeholder="عنوان"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors?.[0] && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0].message}
                </p>
              )}
            </div>
          )}
        />

        <form.Field
          name="question"
          children={(field) => (
            <div>
              <label>متن پیام</label>
              <Input
                placeholder="متن پیام"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors?.[0] && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0].message}
                </p>
              )}
            </div>
          )}
        />

        <form.Field
          name="file"
          children={(field) => (
            <div>
              <label>آپلود فایل</label>
              <Input
                type="file"
                accept="*"
                onChange={(e) =>
                  field.handleChange(e.target.files?.[0] ?? null)
                }
              />
              {field.state.meta.errors?.[0] && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0].message}
                </p>
              )}
            </div>
          )}
        />

        <Button type="submit" className="w-full col-span-full">
          ثبت تیکت
        </Button>
      </form>
    </div>
  );
}
