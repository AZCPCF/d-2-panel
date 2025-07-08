/**
 * Environment variables used across the application.
 *
 * These variables are loaded from Next.js public runtime config (import.meta.env).
 * Make sure to define them in your `.env` or environment settings.
 */

export const apiUrlPrimary: string | undefined = import.meta.env.VITE_API_URL;
export const apiUrlSecondary: string | undefined = import.meta.env
  .VITE_API_URL_SECONDARY;
export const tokenKey: string | undefined = import.meta.env.VITE_TOKEN_KEY;
export const fileUrl: string | undefined = import.meta.env.VITE_FILE_URL;
export const panelUrl: string = import.meta.env.VITE_PANEL_URL || "";
export const appUrl: string = import.meta.env.VITE_APP_URL || "";
const env = {
  apiUrlPrimary,
  apiUrlSecondary,
  tokenKey,
  fileUrl,
  panelUrl,
  appUrl,
};

export default env;
