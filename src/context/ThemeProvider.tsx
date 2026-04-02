import { createContext, useContext, useLayoutEffect, useState } from "react"

export type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "gy-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useLayoutEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    const root = window.document.documentElement
    
    // 1. Add class to temporarily suppress all transitions
    root.classList.add("theme-snap")

    // 2. Immediately update DOM classes for instant synchronization
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)

    // 3. Persist to storage and update React internal state
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)

    // 4. Force a reflow and then remove the snap class
    void root.offsetHeight;
    requestAnimationFrame(() => {
      root.classList.remove("theme-snap")
    })
  }

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div className="theme-wrapper">
        {children}
      </div>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
