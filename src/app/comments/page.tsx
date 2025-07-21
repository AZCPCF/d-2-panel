import CommentCard from "../../components/pages/comment/card";
import Divider from "../../components/ui/divider";
import { useReactQuery } from "../../hooks/use-query";

export default function CommentsPage() {
  const { data } = useReactQuery<{
    data: {
      id: number;
      message: string;
      admin_answer: string | null;
      is_accepted: boolean;
      product: { id: number; title: string };
    }[];
  }>({
    endpoint: "comment",
  });

  return (
    <>
      <Divider title={"نظرات"} />
      <div className="grid grid-cols-4 mt-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        {data?.data.length ? (
          data.data.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            هیچ نظری یافت نشد.
          </p>
        )}
      </div>
    </>
  );
}
