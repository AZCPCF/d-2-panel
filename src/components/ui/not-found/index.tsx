export default function NotFound({ title = "داده ای" }: { title?: string }) {
  return (
    <p className="w-full col-span-full flex justify-center mt-4 text-xl">
      {title} یافت نشد.
    </p>
  );
}
