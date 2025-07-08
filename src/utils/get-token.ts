import { tokenKey } from "./env";

export default function getTokenFromCookies(): string | null {
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)" + tokenKey + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}
