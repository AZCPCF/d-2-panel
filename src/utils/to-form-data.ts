export default function toFormData(values: Record<string, any>): FormData {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  return formData;
}