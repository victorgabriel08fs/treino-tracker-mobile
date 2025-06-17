import moment from "moment";
import "moment/dist/locale/pt-br";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import {
  getPastMonthWorkouts,
  getPastWeekWorkouts,
  getThisMonthWorkouts,
  getThisWeekWorkouts,
  getValidExercises,
  getValidWorkouts,
} from "@/functions";
import { useState } from "react";

const WorkoutNumberCard = ({
  label,
  value,
  icon = null,
  obs = null,
  obsColor = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div className="font-bold text-3xl">{value}</div>
      <div className="font-semibold">{label}</div>
      {obs && (
        <div
          className={`${
            obsColor && obsColor + " animate-pulse"
          } bg-white mt-1 p-1 rounded-sm w-8 h-6 flex items-center justify-center font-bold text-xs`}
        >
          {obs}
        </div>
      )}
    </div>
  );
};

const WorkoutNumbers = ({ workouts, type }) => {
  let pastWorkouts = null;
  if (type === "weekly") {
    pastWorkouts = getPastWeekWorkouts(workouts);
    workouts = getThisWeekWorkouts(workouts);
  } else if (type === "monthly") {
    pastWorkouts = getPastMonthWorkouts(workouts);
    workouts = getThisMonthWorkouts(workouts);
  }
  const workoutsCount = getValidWorkouts(workouts).length;
  const pastWorkoutsCount = getValidWorkouts(pastWorkouts).length;
  const exercisesCount = getValidExercises(workouts).length;
  const pastExercisesCount = getValidExercises(pastWorkouts).length;

  const exercisesTotal = workouts.reduce(
    (total, workout) => total + workout.exercises.length,
    0
  );
  const workoutTime = getValidWorkouts(workouts).reduce(
    (total, workout) => total + workout?.realDuration || 0,
    0
  );
  const workoutTimeTotal = workouts.reduce(
    (total, workout) => total + workout.duration,
    0
  );
  const workoutTimePercent = Math.round((workoutTime * 100) / workoutTimeTotal);
  const weight = getValidExercises(workouts).reduce(
    (total, exercise) => total + exercise.weight * exercise.reps,
    0
  );
  const weightTotal = workouts.reduce(
    (total, workout) =>
      total +
      workout.exercises.reduce(
        (total, exercise) => total + exercise.weight * exercise.reps,
        0
      ),
    0
  );
  const weightPercent = Math.round((weight * 100) / weightTotal);
  return (
    <div className="flex px-5 flex-col gap-10">
      <Carousel className="w-full">
        <CarouselPrevious className="ml-2" />
        <CarouselNext className="mr-2" />
        <CarouselContent className="gap-4 px-4">
          <CarouselItem className="p-4 bg-blue-200 rounded-lg basis-1/3">
            <WorkoutNumberCard
              label={workoutsCount === 1 ? "Treino" : "Treinos"}
              value={workoutsCount}
              obs={
                pastWorkoutsCount != null &&
                pastWorkoutsCount - workoutsCount != 0
                  ? pastWorkoutsCount > workoutsCount
                    ? `↓ ${pastWorkoutsCount - workoutsCount}`
                    : `↑ ${workoutsCount - pastWorkoutsCount}`
                  : null
              }
              obsColor={
                pastWorkoutsCount != null
                  ? pastWorkoutsCount > workoutsCount
                    ? "text-red-500"
                    : "text-green-500"
                  : null
              }
            />
          </CarouselItem>
          <CarouselItem className="p-4 bg-blue-300 rounded-lg basis-1/3">
            <WorkoutNumberCard
              label={exercisesCount === 1 ? "Exercicio" : "Exercicios"}
              value={exercisesCount}
              obs={
                pastExercisesCount != null &&
                pastExercisesCount - exercisesCount != 0
                  ? pastExercisesCount > exercisesCount
                    ? `↓ ${pastExercisesCount - exercisesCount}`
                    : `↑ ${exercisesCount - pastExercisesCount}`
                  : null
              }
              obsColor={
                pastExercisesCount != null
                  ? pastExercisesCount > exercisesCount
                    ? "text-red-500"
                    : "text-green-500"
                  : null
              }
            />
          </CarouselItem>
          <CarouselItem className="p-4 bg-blue-400 rounded-lg basis-1/3">
            <WorkoutNumberCard
              label={
                workoutTime === 1
                  ? "Minuto"
                  : workoutTime > 59
                  ? workoutTime / 60 < 2
                    ? "Hora"
                    : "Horas"
                  : "Minutos"
              }
              value={
                workoutTime > 59 ? Math.floor(workoutTime / 60) : workoutTime
              }
              obs={`${workoutTimePercent + "%"}`}
              obsColor={workoutTimePercent > 70 ? "text-green-500" : null}
            />
          </CarouselItem>
          <CarouselItem className="p-4 bg-blue-500 rounded-lg basis-1/3">
            <WorkoutNumberCard
              label={
                weight === 1
                  ? "Kg"
                  : weight > 1000
                  ? weight / 1000 == 1
                    ? "Ton"
                    : "Tons"
                  : "Kgs"
              }
              value={weight > 1000 ? Math.floor(weight / 1000) : weight}
              obs={`${weightPercent + "%"}`}
              obsColor={weightPercent > 80 ? "text-green-500" : null}
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default WorkoutNumbers;
