# Routing Standards

## Route Structure

**All application routes must be nested under `/dashboard`.**

- The root `/` route is only for public pages (e.g., landing/login page)
- Every feature page lives under `/dashboard` or a sub-path of it
- Example valid routes: `/dashboard`, `/dashboard/workout/[workoutId]`, `/dashboard/workout/create`

## Protected Routes

**All `/dashboard` routes are protected and require an authenticated user.**

Route protection is enforced exclusively via **Next.js Middleware** (`src/middleware.ts`). Do NOT implement auth guards inside individual page components or layouts.

### Middleware Implementation

```ts
// src/middleware.ts
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### Rules

- The middleware must redirect unauthenticated users to `/` (the login page)
- Do NOT use `redirect()` inside page components to enforce auth — that is the middleware's responsibility
- Do NOT add auth checks inside `layout.tsx` files for route protection purposes
- The middleware runs on the edge and must remain lightweight — no database calls

## Adding New Routes

When adding a new page to the app:

1. Create it under `src/app/dashboard/` — e.g., `src/app/dashboard/settings/page.tsx`
2. The middleware matcher (`/dashboard/:path*`) automatically protects it — no extra config needed
3. Do NOT create routes outside of `/dashboard` unless they are explicitly public (login, signup, etc.)
