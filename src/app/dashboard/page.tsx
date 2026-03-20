"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockWorkouts = [
  {
    id: 1,
    name: "Bench Press",
    sets: 4,
    reps: 8,
    weight: 100,
  },
  {
    id: 2,
    name: "Squat",
    sets: 3,
    reps: 5,
    weight: 140,
  },
  {
    id: 3,
    name: "Deadlift",
    sets: 3,
    reps: 5,
    weight: 180,
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Dashboard</h1>

      <div className="mb-8">
        <p className="text-sm text-zinc-500 mb-2">Selected date</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-56 justify-start gap-2">
              <CalendarIcon className="h-4 w-4 text-zinc-400" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d);
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">
          Workouts for {format(date, "do MMM yyyy")}
        </h2>

        {mockWorkouts.length === 0 ? (
          <p className="text-zinc-500 text-sm">No workouts logged for this date.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {mockWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-500">
                    {workout.sets} sets &times; {workout.reps} reps &mdash; {workout.weight} kg
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
