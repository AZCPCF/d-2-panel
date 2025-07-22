import { toast } from "sonner";
import AddressCard from "../../components/pages/addresses/card";
import AddAddressModal from "../../components/pages/addresses/modal";
import Divider from "../../components/ui/divider";
import useModal from "../../hooks/use-modal";
import { useReactMutation } from "../../hooks/use-mutation";
import { useReactQuery } from "../../hooks/use-query";
import NotFound from "../../components/ui/not-found";

export default function AddressesPage() {
  const { Modal, modalOpener, modalCloser } = useModal();

  const { data, refetch } = useReactQuery<{ data: AddressItem[] }>({
    endpoint: "address",
  });

  const deleteMutation = useReactMutation();

  return (
    <>
      <Modal />
      <Divider
        title="آدرس‌ها"
        button={{
          title: "آدرس جدید",
          onClick: () =>
            modalOpener(
              <AddAddressModal modalCloser={modalCloser} refetch={refetch} />
            ),
        }}
      />
      <div className="grid grid-cols-5 gap-4 mt-6 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {data?.data.length ? (
          data?.data.map((item) => (
            <AddressCard
              key={item.id}
              data={item}
              onEdit={() =>
                modalOpener(
                  <AddAddressModal
                    modalCloser={modalCloser}
                    refetch={refetch}
                    data={item}
                  />
                )
              }
              onDelete={async () => {
                await deleteMutation.mutateAsync(
                  { endpoint: `address/${item.id}`, method: "DELETE" },
                  {
                    onSuccess: () => {
                      toast.success("حذف آدرس با موفقیت انجام شد");
                      refetch();
                    },
                  }
                );
              }}
            />
          ))
        ) : (
          <NotFound title="آدرس" />
        )}
      </div>
    </>
  );
}

export type AddressItem = {
  id: number;
  title: string;
  text: string;
  phone_number?: string;
  for_other: boolean;
  full_name?: string;
  province: string;
  city: string;
};
