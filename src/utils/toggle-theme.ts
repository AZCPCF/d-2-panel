const THEME_KEY = "theme";
const DARK = "dark";
const LIGHT = "light";

export const toggleTheme = (): "dark" | "light" => {
  const root = document.documentElement;
  const isDark = root.classList.contains(DARK);
  const nextTheme = isDark ? LIGHT : DARK;

  root.classList.remove(DARK, LIGHT);
  root.classList.add(nextTheme);
  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);

  return nextTheme;
};

export const applyStoredTheme = () => {
  const root = document.documentElement;
  const stored = localStorage.getItem(THEME_KEY);

  const theme = stored === DARK || stored === LIGHT
    ? stored
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK
      : LIGHT;

  root.classList.remove(DARK, LIGHT);
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
};
