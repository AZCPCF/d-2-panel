export default function NotFound({ title = "داده ای" }: { title?: string }) {
  return (
    <p className="w-full col-span-full dark:text-white flex justify-center mt-4 text-xl">
      {title} یافت نشد.
    </p>
  );
}
