import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutsForDate } from "@/data/workouts";
import { DatePicker } from "./date-picker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date: dateParam } = await searchParams;
  const date = dateParam ? new Date(dateParam) : new Date();

  const workouts = await getWorkoutsForDate(userId, date);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Dashboard</h1>

      <div className="mb-8">
        <p className="text-sm text-zinc-500 mb-2">Selected date</p>
        <DatePicker date={date} />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">
          Workouts for {format(date, "do MMM yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <p className="text-zinc-500 text-sm">No workouts logged for this date.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">{workout.name ?? "Workout"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {workout.exercises.map((exercise) => (
                      <div key={exercise.id}>
                        <p className="text-sm font-medium mb-1">{exercise.name}</p>
                        <div className="flex flex-col gap-0.5">
                          {exercise.sets.map((set) => (
                            <p key={set.id} className="text-sm text-zinc-500">
                              Set {set.setNumber}: {set.reps} reps &mdash; {set.weightKg} kg
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
