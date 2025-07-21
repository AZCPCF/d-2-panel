import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import type { AddressItem } from "../../../app/addresses/page";
import cities from "../../../data/cities";
import provinces from "../../../data/provinces";
import { useReactMutation } from "../../../hooks/use-mutation";
import {
  addressSchemaOther,
  addressSchemaSelf,
} from "../../../validations/address";
import { Button } from "../../ui/button";
import { Input } from "../../ui/Input";

export default function AddAddressModal({
  data,
  refetch,
  modalCloser,
}: {
  data?: AddressItem;
  refetch: () => void;
  modalCloser: () => void;
}) {
  const [forOther, setForOther] = useState(data?.for_other || false);
  const [selectedProvince, setSelectedProvince] = useState(
    data?.province || ""
  );
  const handleProvinceChange = (
    provinceId: number,
    field: { handleChange: (s: string) => void }
  ) => {
    field.handleChange(provinceId.toString());
    setSelectedProvince(provinceId.toString());
  };
  const mutate = useReactMutation();

  const formSelf = useForm({
    defaultValues: {
      title: "",
      text: "",
      province: "",
      city: "",
      postal_code: "",
      ...(data
        ? {
            full_name: "",
            phone_number: "",
            ...data,
          }
        : {}),
    },
    onSubmit: async ({ value }) => {
      modalCloser();
      if (data?.id) {
        await mutate.mutateAsync(
          {
            endpoint: `address/${data.id}`,
            method: "PUT",
            body: { ...value, for_other: false },
          },
          {
            onSuccess: () => {
              toast.success("آدرس با موفقیت اضافه شد.");
            },
            onError: () => {
              toast.success("افزودن آدرس با مشکل مواجه شد");
            },
          }
        );
        refetch();
        return;
      }
      await mutate.mutateAsync(
        {
          endpoint: "address",
          method: "POST",
          body: { ...value, for_other: false },
        },
        {
          onSuccess: () => {
            toast.success("آدرس با موفقیت اضافه شد.");
          },
          onError: () => {
            toast.success("افزودن آدرس با مشکل مواجه شد");
          },
        }
      );
      refetch();
    },
    validators: {
      onChange: addressSchemaSelf,
    },
  });

  const formOther = useForm({
    defaultValues: {
      title: "",
      text: "",
      province: "",
      city: "",
      postal_code: "",
      full_name: "",
      phone_number: "",
      ...(data ? data : {}),
    },
    onSubmit: async ({ value }) => {
      modalCloser();
      if (data?.id) {
        await mutate.mutateAsync(
          {
            endpoint: `address/${data.id}`,
            method: "PUT",
            body: { ...value, for_other: true },
          },
          {
            onSuccess: () => {
              toast.success("آدرس با موفقیت اضافه شد.");
            },
            onError: () => {
              toast.success("افزودن آدرس با مشکل مواجه شد");
            },
          }
        );
        refetch();
        return;
      }
      await mutate.mutateAsync(
        {
          endpoint: "address",
          method: "POST",
          body: { ...value, for_other: true },
        },
        {
          onSuccess: () => {
            toast.success("آدرس با موفقیت اضافه شد.");
          },
          onError: () => {
            toast.success("افزودن آدرس با مشکل مواجه شد");
          },
        }
      );
      refetch();
    },
    validators: {
      onChange: addressSchemaOther,
    },
  });

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">افزودن آدرس</h1>

      <div className="flex gap-3">
        <Button
          variant={!forOther ? "default" : "outline"}
          onClick={() => setForOther(false)}
        >
          برای خودم
        </Button>
        <Button
          variant={forOther ? "default" : "outline"}
          onClick={() => setForOther(true)}
        >
          برای شخص دیگر
        </Button>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (forOther) {
            await formOther
              .handleSubmit()
              .then(() => console.log("submitted other"));
          } else {
            await formSelf
              .handleSubmit()
              .then(() => console.log("submitted self"));
          }
        }}
        className="space-y-4 grid grid-cols-2 gap-4"
      >
        {forOther ? (
          <>
            <formOther.Field
              name="title"
              children={(field) => (
                <div>
                  <label>عنوان آدرس</label>
                  <Input
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

            {/* text */}
            <formOther.Field
              name="text"
              children={(field) => (
                <div>
                  <label>نشانی کامل</label>
                  <Input
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

            <formOther.Field
              name="province"
              children={(field) => (
                <div>
                  <label>استان</label>
                  <select
                    value={field.state.value}
                    onChange={(e) =>
                      handleProvinceChange(+e.target.value, field)
                    }
                    className="input !mb-0"
                  >
                    <option value="">انتخاب کنید</option>
                    {provinces.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </div>
              )}
            />

            <formOther.Field
              name="city"
              children={(field) => (
                <div>
                  <label>شهر</label>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input !mb-0"
                  >
                    <option value="">انتخاب کنید</option>
                    {cities
                      .filter((item) => item.province_id === +selectedProvince)
                      ?.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.title}
                        </option>
                      ))}
                  </select>
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* postal_code */}
            <formOther.Field
              name="postal_code"
              children={(field) => (
                <div>
                  <label>کد پستی</label>
                  <Input
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
            <formOther.Field
              name="full_name"
              children={(field) => (
                <div>
                  <label>نام و نام خانوادگی</label>
                  <Input
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
            <formOther.Field
              name="phone_number"
              children={(field) => (
                <div>
                  <label>شماره تماس</label>
                  <Input
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
          </>
        ) : (
          <>
            <formSelf.Field
              name="title"
              children={(field) => (
                <div>
                  <label>عنوان آدرس</label>
                  <Input
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

            {/* text */}
            <formSelf.Field
              name="text"
              children={(field) => (
                <div>
                  <label>نشانی کامل</label>
                  <Input
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

            {/* province */}
            <formSelf.Field
              name="province"
              children={(field) => (
                <div>
                  <label>استان</label>
                  <select
                    value={field.state.value}
                    onChange={(e) =>
                      handleProvinceChange(+e.target.value, field)
                    }
                    className="input !mb-0"
                  >
                    <option value="">انتخاب کنید</option>
                    {provinces.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        className="*:!font-kalameh"
                      >
                        {item.title}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </div>
              )}
            />

            <formSelf.Field
              name="city"
              children={(field) => (
                <div>
                  <label>شهر</label>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input !mb-0"
                  >
                    <option value="">انتخاب کنید</option>
                    {cities
                      .filter((item) => item.province_id === +selectedProvince)
                      ?.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.title}
                        </option>
                      ))}
                  </select>
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </div>
              )}
            />
            {/* postal_code */}
            <formSelf.Field
              name="postal_code"
              children={(field) => (
                <div>
                  <label>کد پستی</label>
                  <Input
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
          </>
        )}

        <Button type="submit" className="w-full col-span-full">
          ثبت آدرس
        </Button>
      </form>
    </div>
  );
}
