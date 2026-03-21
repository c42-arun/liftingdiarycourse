# Data Mutation Standards

## Overview

Data mutations follow a two-layer pattern:

1. **`/data` helper functions** — encapsulate all Drizzle ORM db calls
2. **Server actions** — call those helpers and are the only entry point for mutations from the UI

Neither layer may be bypassed.

---

## Layer 1: `/data` Helper Functions

All database write operations (insert, update, delete) MUST be encapsulated in helper functions inside `src/data/`. Server actions call these helpers — they do not interact with the database directly.

**Rules:**
- Every mutation must have a dedicated helper function in `src/data/`
- Helpers MUST use Drizzle ORM — do NOT write raw SQL
- Helper functions accept plain typed arguments, including `userId` for any user-scoped mutation
- Never expose a mutation helper that operates across all users — always scope to the authenticated user

**Example:**
```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkout(userId: string, name: string) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name })
    .returning();
  return workout;
}

export async function deleteWorkout(workoutId: number, userId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

---

## Layer 2: Server Actions

All mutations triggered from the UI MUST go through Next.js Server Actions. Server actions MUST be defined in colocated `actions.ts` files, co-located with the route or component that uses them.

**Rules:**
- Server action files MUST be named `actions.ts` and placed alongside the relevant page or component
- Every file must have `"use server"` at the top
- Server actions MUST NOT accept `FormData` — use typed plain object parameters instead
- ALL server action parameters MUST be validated with [Zod](https://zod.dev) before doing anything else
- The authenticated `userId` must be retrieved inside the server action via `auth()` — never trust a `userId` passed from the client
- Server actions call `/data` helper functions — they do not query the database themselves
- Do NOT call `redirect()` inside a server action — server actions must return and let the client handle navigation via `useRouter()`

**Example structure:**
```
src/
  app/
    dashboard/
      page.tsx
      actions.ts   ← server actions for the dashboard route
    workouts/
      [id]/
        page.tsx
        actions.ts ← server actions for the workout detail route
```

**Example server action:**
```ts
// src/app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
});

export async function createWorkoutAction(params: { name: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { name } = createWorkoutSchema.parse(params);

  return createWorkout(userId, name);
}
```

The calling client component is responsible for redirecting after the action resolves:

```ts
// some-form.tsx (client component)
startTransition(async () => {
  await createWorkoutAction({ name });
  router.push("/dashboard"); // ← redirect happens here, client-side
});
```

---

## What NOT to Do

**Do NOT use `FormData` as a parameter type:**
```ts
// WRONG
export async function createWorkoutAction(formData: FormData) { ... }
```

**Do NOT skip Zod validation:**
```ts
// WRONG — no validation on incoming params
export async function createWorkoutAction(params: { name: string }) {
  return createWorkout(userId, params.name);
}
```

**Do NOT query the database inside a server action directly:**
```ts
// WRONG — server actions must delegate to /data helpers
export async function createWorkoutAction(params: { name: string }) {
  const { name } = createWorkoutSchema.parse(params);
  await db.insert(workouts).values({ userId, name }); // ← not allowed
}
```

**Do NOT call `redirect()` inside a server action:**
```ts
// WRONG — redirects must be handled client-side
export async function createWorkoutAction(params: { name: string }) {
  // ...
  await createWorkout(userId, name);
  redirect("/dashboard"); // ← not allowed
}
```

**Do NOT trust a `userId` from the client:**
```ts
// WRONG — userId must come from auth(), never from the caller
export async function deleteWorkoutAction(params: { workoutId: number; userId: string }) { ... }
```
