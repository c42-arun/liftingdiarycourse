# Server Component Coding Standards

## Route Parameters: Always Await `params`

This project uses **Next.js 15**, where `params` (and `searchParams`) are **Promises** and MUST be awaited before accessing their properties.

**Do NOT destructure `params` synchronously:**
```ts
// WRONG — params is a Promise in Next.js 15
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params; // ← runtime error
}
```

**Always type `params` as a Promise and await it:**
```ts
// CORRECT
interface PageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { workoutId } = await params;
}
```

This applies to all dynamic route segments — single (`[id]`), catch-all (`[...slug]`), and optional catch-all (`[[...slug]]`).

## `searchParams` Must Also Be Awaited

The same rule applies to `searchParams`:

```ts
// WRONG
export default async function Page({ searchParams }: { searchParams: { q: string } }) {
  const { q } = searchParams; // ← runtime error
}

// CORRECT
interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { q } = await searchParams;
}
```

## Authentication

All protected server components must check for an authenticated session and redirect if none is found:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
}
```

See [auth.md](./auth.md) for full authentication standards.

## Data Fetching

Server components fetch data by calling helper functions from `/data` — never by querying the database directly or using client-side fetching.

See [data-fetching.md](./data-fetching.md) for full data fetching standards.
