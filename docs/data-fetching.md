# Data Fetching Guidelines

## CRITICAL: Server Components Only

**ALL data fetching MUST be done exclusively via React Server Components.**

Do NOT fetch data via:
- Route handlers (`src/app/api/`)
- Client components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side data fetching library
- Any other mechanism

Server components are the only approved data fetching pattern in this application. If you find yourself reaching for a client-side fetching solution, stop and restructure to use a server component instead.

## Database Access: `/data` Directory

All database queries MUST go through helper functions located in the `/data` directory.

**Rules:**
- Every database query must be encapsulated in a helper function inside `/data`
- Helper functions MUST use Drizzle ORM — do NOT write raw SQL
- Server components call these helper functions directly; they do not query the database themselves

**Example structure:**
```
src/
  data/
    workouts.ts   # getWorkoutsForUser(), getWorkoutById(), etc.
    exercises.ts  # getExercisesForUser(), etc.
```

**Example helper function:**
```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

**Example server component usage:**
```ts
// src/app/dashboard/page.tsx
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);
  // ...
}
```

## Data Isolation: Users Can Only Access Their Own Data

**This is a security requirement, not a preference.**

Every helper function in `/data` that returns user-specific data MUST filter by the authenticated user's ID. A user must never be able to access another user's data.

- Always accept `userId` as a parameter and apply it as a `WHERE` filter in every query
- Never expose a "get all" function that returns data across all users
- Do not trust user-supplied IDs from URL params or request bodies without verifying ownership against the authenticated session user

**Wrong:**
```ts
// NEVER do this — returns data for any userId passed in without auth check
export async function getWorkout(workoutId: string) {
  return db.select().from(workouts).where(eq(workouts.id, workoutId));
}
```

**Correct:**
```ts
// Always scope to the authenticated user
export async function getWorkout(workoutId: string, userId: string) {
  const result = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
  return result[0] ?? null;
}
```

The `userId` passed to these functions must always come from the server-side session (e.g., `auth()`), never from client-supplied input.
