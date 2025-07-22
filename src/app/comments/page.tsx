import CommentCard from "../../components/pages/comment/card";
import Divider from "../../components/ui/divider";
import NotFound from "../../components/ui/not-found";
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
      <div className="grid grid-cols-4 mt-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-3">
        {data?.data.length ? (
          data.data.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <NotFound title="نظری" />
        )}
      </div>
    </>
  );
}
