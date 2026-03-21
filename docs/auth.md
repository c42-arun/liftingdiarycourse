# Authentication Standards

## Provider: Clerk

**This application uses [Clerk](https://clerk.com) exclusively for authentication.**

Do NOT implement any other authentication mechanism. Do not use NextAuth, custom JWT logic, session cookies, or any other auth library. Clerk is the only approved provider.

The Clerk package is `@clerk/nextjs`.

## Middleware

All route protection is handled via `clerkMiddleware()` in `src/middleware.ts`. This must remain in place and must not be removed or replaced.

```ts
// src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

## Getting the Authenticated User (Server Components)

Use `auth()` from `@clerk/nextjs/server` to get the current user's ID in server components. Always redirect to `/sign-in` if no session is present.

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // userId is now safe to use
}
```

**Rules:**
- Always use `auth()` from `@clerk/nextjs/server` — never from the client
- Always guard protected pages with `if (!userId) redirect("/sign-in")`
- Pass `userId` to data helper functions in `/data` — never expose or trust a user-supplied ID

## UI Components

Clerk provides pre-built UI components for sign-in/sign-up flows and the user button. Use these — do not build custom auth UI.

The root layout wraps the app in `<ClerkProvider>` and uses `<Show>`, `<SignInButton>`, `<SignUpButton>`, and `<UserButton>` to render auth controls:

```tsx
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

// In layout.tsx
<ClerkProvider>
  <header>
    <Show when="signed-out">
      <SignInButton />
      <SignUpButton />
    </Show>
    <Show when="signed-in">
      <UserButton />
    </Show>
  </header>
  {children}
</ClerkProvider>
```

**Rules:**
- `<ClerkProvider>` must wrap the entire app in the root layout — do not remove it
- Use `<Show when="signed-in">` / `<Show when="signed-out">` for conditional auth UI
- Do not build custom sign-in or sign-up pages unless Clerk's hosted pages are insufficient

## Environment Variables

Clerk requires the following environment variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

These must be set in `.env.local` and must never be committed to version control.
