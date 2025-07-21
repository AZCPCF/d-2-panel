import Cookies from "js-cookie";
import { tokenKey } from "./env";
export default function getTokenFromCookies(): string | undefined {
  return Cookies.get(tokenKey || "");
}
