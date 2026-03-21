# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Documentation First

**Before generating any code, ALWAYS consult the relevant documentation in the `/docs` directory first.** This applies to all features, components, APIs, and integrations. The `/docs` directory contains project-specific guidance that must be followed. Only proceed with implementation after reviewing the applicable docs:

- docs/ui.md
- docs/data-fetching.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- Fonts: Geist Sans and Geist Mono via `next/font/google`

## Architecture

This is a Next.js App Router project. All routes and layouts live under `src/app/`. The root layout (`src/app/layout.tsx`) sets up fonts and metadata. Currently only a single page exists (`src/app/page.tsx`) — this is a starter scaffold for a lifting diary application.
