import { getValidWorkouts } from "@/functions";
import { isSameDay } from "date-fns";
import moment from "moment";
import { WorkoutIcon } from "./WorkoutIcon";
const DayCard = ({ day, workout }) => {
  const isCompleted = workout ? getValidWorkouts([workout]).length > 0 : false;

  const isBeforeToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const incomingDate = new Date(date);
    incomingDate.setHours(0, 0, 0, 0);

    return incomingDate.getTime() < today.getTime();
  };

  return (
    <div
      className={`flex flex-col items-center justify-between min-w-24 h-32 px-2 py-2 rounded-lg border border-b-4 ${
        workout
          ? isCompleted
            ? "border-b-green-500"
            : isBeforeToday(workout?.date)
            ? "border-b-red-500"
            : "border-b-yellow-500"
          : "border-b-gray-500"
      } bg-amber-100`}
    >
      <div className="font-bold text-xs">{day}</div>
      <div><WorkoutIcon type={workout?.workoutType} /></div>
      <div className="font-semibold text-sm max-w-20 text-center break-words overflow-hidden text-ellipsis line-clamp-2">
        {workout?.name ?? "Sem treino"}
      </div>
    </div>
  );
};

const WeekReview = ({ workouts, weekDates }) => {
  return (
    <div className="mt-10 mb-10 w-full">
      <h2 className="text-xl font-semibold mb-3">Para esta semana</h2>
      <div className="flex w-full justify-between gap-2 px-2 py-1 overflow-x-auto">
        {weekDates.map((day) => (
          <DayCard
            key={day.toString()}
            day={day.format("ddd")}
            workout={workouts.find((workout) =>
              isSameDay(day.toDate(), workout.date)
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekReview;
