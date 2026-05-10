<div align="center">

<br/>

<!-- Replace with your actual hero screenshot -->
![Portfolio Hero](./docs/screenshots/hero-dark.png)

<br/>

# ✦ Gayan Kavinda — Portfolio

**A cinematic, high-performance developer portfolio built with React + Vite**  
Distributed systems architect. Premium digital experiences. Precision engineering.

<br/>

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02?style=flat-square&logo=greensock&logoColor=black)](https://greensock.com/gsap/)

<br/>

[**🌐 Live Site**](#) · [**📁 Projects**](#-project-showcase) · [**🚀 Quick Start**](#-quick-start)

---

</div>

## ✦ Overview

This portfolio is engineered to the same standard as production software — not a template, not a theme. Every interaction, transition, and layout decision was intentional. It features:

- 🎭 **Cinematic Hero** — Character-split text animations with 3D perspective and floating atmospheric orbs
- 🌗 **Dual Theme System** — Dark/light modes with per-section background artwork (anime-aesthetic)
- 🔭 **Live AI Chatbot** — Persona-based portfolio assistant powered by an LLM API
- 🏗️ **9 Project Deep-Dives** — Full Zen-aesthetic project detail pages with scroll-triggered architecture schemas
- ✨ **Premium Micro-interactions** — Magnetic buttons, custom cursor, scroll-reveal, and shimmer borders
- 📐 **Feature-Sliced Architecture** — Clean, scalable codebase following React best practices

<br/>

## 📸 Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="./docs/screenshots/hero-dark.png" alt="Hero – Dark Mode" />
      <br/><sub><b>Hero — Dark Mode</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="./docs/screenshots/hero-light.png" alt="Hero – Light Mode" />
      <br/><sub><b>Hero — Light Mode</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./docs/screenshots/projects.png" alt="Selected Projects Section" />
      <br/><sub><b>Selected Projects — Marquee</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="./docs/screenshots/project-detail.png" alt="Project Detail Page" />
      <br/><sub><b>Project Detail — Zen Scroll Layout</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./docs/screenshots/about.png" alt="About Section" />
      <br/><sub><b>About — Engineering Philosophy</b></sub>
    </td>
    <td align="center" width="50%">
      <img src="./docs/screenshots/chatbot.png" alt="AI Chatbot" />
      <br/><sub><b>AI Portfolio Assistant</b></sub>
    </td>
  </tr>
</table>

> **Note:** Add your own screenshots to `./docs/screenshots/` and update the paths above.

<br/>

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 3 + Vanilla CSS |
| **Animations** | Framer Motion, GSAP + ScrollTrigger |
| **3D / WebGL** | React Three Fiber, Three.js, OGL |
| **Routing** | React Router DOM v6 |
| **UI Primitives** | shadcn/ui (Radix UI), Lucide React |
| **AI / Chat** | Custom LLM integration via REST API |
| **Smooth Scroll** | Lenis |
| **Fonts** | Audiowide, Plus Jakarta Sans, Playfair Display, Syne |

<br/>

## 🗂️ Project Showcase

| # | Project | Stack | Category |
|---|---|---|---|
| 01 | **Distributed Task Engine** | Go · Kafka · Redis · K8s | Backend |
| 02 | **Real-time Analytics** | React · D3.js · Node.js · PostgreSQL | Full-Stack |
| 03 | **AuthShield SDK** | TypeScript · OAuth · WebAuthn · FIDO2 | Open Source |
| 04 | **DataPipe** | Python · Kafka · Airflow | Data Engineering |
| 05 | **CloudDash** | React · AWS · Terraform | DevOps |
| 06 | **APIForge** | Go · gRPC · Protobuf | Open Source |
| 07 | **MobileTrack** | React Native · Firebase · Maps API | Mobile |
| 08 | **ChatScale** | Node.js · WebSocket · Redis | Backend |
| 09 | **DevMetrics** | TypeScript · PostgreSQL · DORA | Open Source |

<br/>

## 📁 Folder Structure

```
src/
├── app/                    # App-level providers (theme, router)
├── assets/                 # Images, videos, fonts
├── components/
│   ├── animations/         # Reusable animation components
│   │   ├── AtmosphericParticles.tsx
│   │   ├── Magnetic.tsx
│   │   └── MaskTransition.tsx
│   ├── common/             # Shared UI (ThemeToggle)
│   ├── layout/             # Navbar, Footer, Sidebar, PreLoader
│   └── ui/                 # Design primitives (Button, Card, Badge, etc.)
├── features/               # Feature-sliced modules
│   ├── about/              # About section + Engineering Philosophy
│   ├── agent/              # AI Chatbot (hooks, services, data)
│   ├── contact/            # Contact form
│   ├── home/               # Hero, TechStack, Experience, Education, Certifications
│   └── projects/           # Project cards, filters, detail data
├── lib/                    # SEO utilities, class helpers
├── pages/                  # Top-level page components
├── registry/               # Custom UI components (signature, etc.)
└── styles/                 # Global CSS (base, animations, utilities)
```

<br/>

## 🚀 Quick Start

### Prerequisites
- Node.js **18+**
- npm or yarn

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/GayanKavinda/garan-yaka-portfolio.git
cd garan-yaka-portfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your API keys (see below)

# 4. Start the dev server
npm run dev
```

The app will be running at `http://localhost:3003`

<br/>

## ⚙️ Environment Variables

Create a `.env` file in the root with the following:

```env
# AI Chatbot API
VITE_AI_API_KEY=your_api_key_here
VITE_AI_BASE_URL=https://your-api-endpoint.com

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

<br/>

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3003 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

<br/>

## 🎨 Design System

The portfolio uses a custom CSS variable-based design system:

```css
/* Core palette */
--crimson: 348 83% 52%;       /* Accent red */
--gold: 43 96% 58%;           /* Warm highlight */
--primary: 262 80% 65%;       /* Violet (#7C5CFC) */
--secondary: 199 100% 50%;    /* Cyan (#00D4FF) */

/* Used as: hsl(var(--primary)) */
```

Dark and light themes are toggled via the `ThemeProvider` and persisted in `localStorage`.

<br/>

## 📦 Deployment

```bash
# Build the project
npm run build

# The output will be in /dist — deploy to:
# Vercel, Netlify, GitHub Pages, or any static host
```

For **XAMPP / Apache** local deployment, the `dist/` folder can be placed directly in `htdocs/`.

<br/>

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).

---

<div align="center">

**Built with precision by [Gayan Kavinda](https://github.com/GayanKavinda)**

*Architecting systems that scale. Crafting experiences that resonate.*

</div>
