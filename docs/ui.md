# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do NOT create custom components. If a UI element is needed, find the appropriate shadcn/ui component.
- Do NOT use raw HTML elements styled with Tailwind as standalone components — always reach for the shadcn/ui equivalent first.
- All shadcn/ui components live in `src/components/ui/` and are installed via the CLI (`npx shadcn@latest add <component>`).

## Date Formatting

All dates must be formatted using [date-fns](https://date-fns.org/).

Dates must follow this format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use `format` from `date-fns` with the `do MMM yyyy` format token:

```ts
import { format } from "date-fns";

format(new Date("2025-09-01"), "do MMM yyyy"); // "1st Sep 2025"
format(new Date("2025-08-02"), "do MMM yyyy"); // "2nd Aug 2025"
```
