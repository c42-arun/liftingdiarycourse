"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1, "Workout name is required").max(255),
});

export async function updateWorkoutAction(params: { workoutId: number; name: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { workoutId, name } = updateWorkoutSchema.parse(params);

  return updateWorkout(workoutId, userId, name);
}
