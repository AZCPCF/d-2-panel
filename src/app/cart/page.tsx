import { useReactQuery } from "../../hooks/use-query";

export default function CartPage(){
    const {data} = useReactQuery({endpoint:"cart"})
    console.log(data);
}