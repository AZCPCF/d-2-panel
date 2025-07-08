// app/products/[slug]/page.tsx
import { useParams } from "@tanstack/react-router";

export default function Slug() {
  const { slug } = useParams({ strict: false }) as { slug: string };
console.log(slug);
  return <p>Slug: {slug}</p>;
}
