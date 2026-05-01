import { createContext, useContext, useLayoutEffect, useRef, useState, useCallback } from "react"

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

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "dark",
  setTheme: () => null,
})

const DARK_BG = [9, 9, 16] as const
const LIGHT_BG = [245, 245, 250] as const

function getOrCreateLayers() {
  let washC = document.getElementById("gy-wash-canvas") as HTMLCanvasElement
  let windC = document.getElementById("gy-wind-canvas") as HTMLCanvasElement

  if (!washC) {
    const base = `position:fixed;inset:0;width:100%;height:100%;pointer-events:none;`
    washC = document.createElement("canvas")
    washC.id = "gy-wash-canvas"
    washC.style.cssText = base + "z-index:999997;"
    document.body.appendChild(washC)

    windC = document.createElement("canvas")
    windC.id = "gy-wind-canvas"
    windC.style.cssText = base + "z-index:999999;"
    document.body.appendChild(windC)
  }

  return {
    washC: washC!,
    windC: windC!,
    wCtx: washC.getContext("2d")!,
    rCtx: windC.getContext("2d")!,
  }
}

class Petal {
  x: number; y: number; vx: number; vy: number
  r: number; rot: number; rotV: number
  alpha = 0; life = 0; maxLife: number
  wobble: number; wobbleSpeed: number; color: string

  constructor(toLight: boolean, W: number, H: number) {
    this.x = toLight ? -20 + Math.random() * 50 : W + 20 - Math.random() * 50
    this.y = Math.random() * H
    this.vx = toLight ? 4 + Math.random() * 5 : -(4 + Math.random() * 5)
    this.vy = (Math.random() - 0.5) * 2
    this.r = 5 + Math.random() * 9
    this.rot = Math.random() * Math.PI * 2
    this.rotV = (Math.random() - 0.5) * 0.2
    this.maxLife = 80 + Math.random() * 70
    this.wobble = Math.random() * Math.PI * 2
    this.wobbleSpeed = 0.05 + Math.random() * 0.05
    this.color = toLight
      ? `hsl(${280 + Math.random() * 40},${70 + Math.random() * 20}%,${65 + Math.random() * 15}%)`
      : `hsl(${35 + Math.random() * 30},${80 + Math.random() * 20}%,${60 + Math.random() * 20}%)`
  }

  update() {
    this.life++
    this.wobble += this.wobbleSpeed
    this.x += this.vx + Math.sin(this.wobble) * 0.7
    this.y += this.vy + Math.sin(this.wobble * 0.7) * 0.6
    this.rot += this.rotV
    const t = this.life / this.maxLife
    this.alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1
    return this.life < this.maxLife
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rot)
    ctx.globalAlpha = this.alpha * 0.8
    
    // Simplified petal shape: faster to draw than Bezier curves
    ctx.beginPath()
    ctx.ellipse(0, 0, this.r * 0.8, this.r * 0.4, 0, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    
    // Minimal stroke
    ctx.strokeStyle = "rgba(255,255,255,0.15)"
    ctx.lineWidth = 0.5
    ctx.stroke()
    ctx.restore()
  }
}

class DustMote {
  x: number; y: number; vx: number; vy: number
  r: number; alpha = 0; life = 0; maxLife: number
  wobble: number; color: string

  constructor(toLight: boolean, W: number, H: number) {
    this.x = toLight ? -5 + Math.random() * 40 : W + 5 - Math.random() * 40
    this.y = Math.random() * H
    this.vx = toLight ? 3 + Math.random() * 7 : -(3 + Math.random() * 7)
    this.vy = (Math.random() - 0.5) * 1.5
    this.r = 0.7 + Math.random() * 1.8
    this.maxLife = 55 + Math.random() * 55
    this.wobble = Math.random() * Math.PI * 2
    this.color = toLight ? "rgba(200,180,255,1)" : "rgba(255,200,100,1)"
  }

  update() {
    this.life++
    this.wobble += 0.09
    this.x += this.vx
    this.y += this.vy + Math.sin(this.wobble) * 0.4
    const t = this.life / this.maxLife
    this.alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 0.55 + Math.random() * 0.2
    return this.life < this.maxLife
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.restore()
  }
}

function drawWash(
  ctx: CanvasRenderingContext2D,
  toLight: boolean,
  washProgress: number,
  W: number, H: number
) {
  ctx.clearRect(0, 0, W, H)
  if (washProgress <= 0) return

  const toBg = toLight ? LIGHT_BG : DARK_BG
  const spreadW = W * 0.55
  const edgeX = toLight
    ? -W * 0.3 + washProgress * (W * 1.6)
    : W * 1.3 - washProgress * (W * 1.6)

  const grad = ctx.createLinearGradient(
    toLight ? edgeX - spreadW : edgeX + spreadW, 0,
    toLight ? edgeX + spreadW * 0.3 : edgeX - spreadW * 0.3, 0
  )

  const [r, g, b] = toBg
  const c = Math.max(0, Math.min(1, washProgress))

  grad.addColorStop(0, `rgba(${r},${g},${b},${c})`)
  grad.addColorStop(0.40, `rgba(${r},${g},${b},${c * 0.95})`)
  grad.addColorStop(0.75, `rgba(${r},${g},${b},${c * 0.4})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
}

function runWindTransition(
  toLight: boolean,
  onSwap: () => void,
  onDone: () => void
) {
  const { washC, windC, wCtx, rCtx } = getOrCreateLayers()

  washC.width = windC.width = window.innerWidth
  washC.height = windC.height = window.innerHeight

  const W = washC.width
  const H = washC.height

  type Particle = Petal | DustMote
  let particles: Particle[] = []

  const TOTAL = 1300
  let elapsed = 0
  let lastSpawn = 0
  let swapped = false
  let washProgress = 0

  function step() {
    elapsed += 16
    const progress = Math.min(elapsed / TOTAL, 1)
    const intensity = progress < 0.5
      ? progress / 0.5
      : 1 - (progress - 0.5) / 0.5

    // Wash leads the wind slightly
    const washTarget = Math.min(1, progress * 1.35)
    washProgress += (washTarget - washProgress) * 0.08
    drawWash(wCtx, toLight, washProgress, W, H)

    // Spawn particles
    // Spawn particles: reduced rate for better performance
    if (elapsed - lastSpawn > 35) {
      lastSpawn = elapsed
      // Dynamic count based on intensity
      const n = Math.floor(intensity * 3) + 1
      for (let i = 0; i < n; i++) {
        if (particles.length < 450) { // Hard cap on particle count
          particles.push(
            Math.random() < 0.4
              ? new DustMote(toLight, W, H)
              : new Petal(toLight, W, H)
          )
        }
      }
    }

    rCtx.clearRect(0, 0, W, H)
    particles = particles.filter(p => p.update())
    particles.forEach(p => p.draw(rCtx))

    // Swap theme when wash covers ~92% — completely invisible under wash
    if (washProgress > 0.92 && !swapped) {
      swapped = true
      onSwap()
    }

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      if (!swapped) {
        swapped = true
        onSwap()
      }
      wCtx.clearRect(0, 0, W, H)
      rCtx.clearRect(0, 0, W, H)
      onDone()
    }
  }

  requestAnimationFrame(step)
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "gy-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const animating = useRef(false)

  useLayoutEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    if (animating.current || newTheme === theme) return
    animating.current = true

    document.documentElement.classList.add("theme-transition")
    document.documentElement.classList.add("is-switching-theme")

    runWindTransition(
      newTheme === "light",
      () => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(newTheme)
        localStorage.setItem(storageKey, newTheme)
        setThemeState(newTheme)
      },
      () => { 
        animating.current = false
        // Snappy removal of transition class
        setTimeout(() => {
          document.documentElement.classList.remove("theme-transition")
          document.documentElement.classList.remove("is-switching-theme")
        }, 500)
      }
    )
  }, [theme, storageKey])

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, setTheme }}>
      <div className="theme-wrapper">{children}</div>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}