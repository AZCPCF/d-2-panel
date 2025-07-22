export default function toFormData(
  values: Record<string, string | Blob | null | undefined | number>
): FormData {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, typeof value == "number" ? `${value}` : value);
    }
  });
  return formData;
}
