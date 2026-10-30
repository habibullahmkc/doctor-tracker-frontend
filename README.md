# Doctor Tracker — Frontend

Admin portal for managing doctors, their patients and healthcare analytics.
Built with **Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui and TanStack Query**.

> 🚧 Work in progress — full documentation (architecture, technical decisions, screenshots) will be added here.

## Tech Stack

| Concern         | Choice                                      |
| --------------- | ------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)          |
| Language        | TypeScript                                  |
| Styling / UI    | Tailwind CSS v4, shadcn/ui (Radix)          |
| Server state    | TanStack Query                              |
| URL state       | nuqs                                        |
| Forms           | React Hook Form + Zod                       |
| Charts          | Recharts                                    |
| Route guarding  | `src/proxy.ts` + `jose` (JWT verification)  |

## Setup Guide

Requires Node.js 20+ and the [backend API](https://github.com/habibullahmkc/doctor-tracker-backend) running.

```bash
git clone https://github.com/habibullahmkc/doctor-tracker-frontend.git
cd doctor-tracker-frontend
npm install
cp .env.example .env.local   # set BACKEND_URL and JWT_SECRET
npm run dev                  # http://localhost:3000
```

### Environment Variables

| Variable      | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `BACKEND_URL` | Base URL of the Express API. `/api/*` is proxied here (no trailing slash) |
| `JWT_SECRET`  | Same value as the backend; lets `proxy.ts` verify the session cookie     |

## How requests flow

```
Browser ──▶ Next.js (Vercel) ── proxy.ts: verify JWT cookie, redirect to /login if missing
                │
                └─ /api/* ──rewrite──▶ Express API (Render) ──▶ MongoDB Atlas
```

The browser only ever talks to the Next.js origin, so the HttpOnly auth cookie is first-party
and is never blocked by third-party cookie restrictions.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/        # public sign-in page
│   └── (dashboard)/         # protected pages: dashboard, doctors, patients
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── layout/              # sidebar, topbar, logo
│   ├── shared/              # reusable building blocks (tables, filters, dialogs)
│   └── dashboard|doctors|patients/
├── hooks/                   # custom React hooks
├── lib/                     # api client, constants, utils
├── services/                # typed API calls per resource
├── types/                   # shared TypeScript types
├── validations/             # Zod schemas for forms
└── proxy.ts                 # route protection (Next.js 16 "proxy", formerly middleware)
```
