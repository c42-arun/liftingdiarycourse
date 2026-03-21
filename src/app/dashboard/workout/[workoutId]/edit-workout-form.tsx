"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWorkoutAction } from "./actions";

interface EditWorkoutFormProps {
  workoutId: number;
  initialName: string;
}

export function EditWorkoutForm({ workoutId, initialName }: EditWorkoutFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Workout name is required.");
      return;
    }

    startTransition(async () => {
      await updateWorkoutAction({ workoutId, name: name.trim() });
      router.push("/dashboard");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Workout name</Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g. Push day, Leg day..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
