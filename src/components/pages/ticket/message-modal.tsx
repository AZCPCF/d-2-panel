import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useReactMutation } from "../../../hooks/use-mutation";
import toFormData from "../../../utils/to-form-data";
import { TicketMessageSchema } from "../../../validations/ticket";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/button";

// ✅ Helper to convert values to FormData

export default function TicketMessageModal({
  closeModal,
  ticket_id,
}: {
  ticket_id?: number;
  closeModal: () => void;
}) {
  const { mutateAsync } = useReactMutation();

  const form = useForm({
    defaultValues: {
      answer: "",
      file: null as File | null,
    },
    validators: { onChange: TicketMessageSchema },
    onSubmit: async ({ value }) => {
      await mutateAsync(
        {
          endpoint: "ticket_message",
          body: toFormData({ ...value, ticket_id }),
        },
        {
          onSuccess: () => {
            toast.success("پیام تیکت با موفقیت ثبت شد.");
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
      <h2 className="text-2xl">ثبت پیام تیکت</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="grid grid-cols-1 mt-3 gap-3"
        encType="multipart/form-data"
      >
        <form.Field
          name="answer"
          children={(field) => (
            <div>
              <label>پیام</label>
              <Input
                placeholder="پیام"
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
