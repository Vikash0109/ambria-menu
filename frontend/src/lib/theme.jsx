// Dark mode removed — theme is always light.
// Kept as a no-op so existing imports don't break.
export function ThemeProvider({ children }) {
  return children
}

export function useTheme() {
  return { dark: false, toggle: () => {} }
}
