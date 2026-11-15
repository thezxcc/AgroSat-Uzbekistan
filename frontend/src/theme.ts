export type Theme = 'light' | 'dark'

const storageKey = 'agrosat-color-theme'

export function initialTheme(): Theme {
  try {
    return window.localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    window.localStorage.setItem(storageKey, theme)
  } catch {
    // The switch still works if storage is disabled.
  }
}
