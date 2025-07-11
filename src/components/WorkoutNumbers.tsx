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
          } bg-white mt-1 p-1 rounded-sm w-fit h-fit flex items-center justify-center font-bold text-xs`}
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
  pastWorkouts = getValidWorkouts(pastWorkouts);
  workouts = getValidWorkouts(workouts);
  const exercises = getValidExercises(workouts);
  const pastExercises = getValidExercises(pastWorkouts);
  const workoutsCount = workouts.length;
  const pastWorkoutsCount = pastWorkouts.length;
  const exercisesCount = exercises.length;
  const pastExercisesCount = pastExercises.length;
  const cardio = workouts.filter(
    (workout) => workout?.cardio?.isCompleted
  ).length;
  const expectedCardioTime = workouts.reduce(
    (total, workout) =>
      total +
      (workout?.cardio?.isCompleted ? workout.cardio?.duration || 0 : 0),
    0
  );
  const cardioTime = workouts.reduce(
    (total, workout) =>
      total +
      (workout?.cardio?.isCompleted ? workout.cardio?.realDuration || 0 : 0),
    0
  );
  const cardioDistance = workouts.reduce(
    (total, workout) =>
      total +
      (workout?.cardio?.isCompleted ? workout.cardio?.realDistance || 0 : 0),
    0
  );
  let cardioPace = null;
  if (cardioTime && cardioDistance) cardioPace = cardioTime / cardioDistance;

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
  console.log({
    cardioTime,
    cardioDistance,
    cardioPace,
    a: cardioTime/60,
    b: Math.floor(cardioTime/60),
    
  })
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
                    ? `↓${pastWorkoutsCount - workoutsCount}`
                    : `↑${workoutsCount - pastWorkoutsCount}`
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
                    ? `↓${pastExercisesCount - exercisesCount}`
                    : `↑${exercisesCount - pastExercisesCount}`
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
          <CarouselItem className="p-4 bg-red-500 rounded-lg basis-1/3">
            <WorkoutNumberCard
              label={"Cardio" + (cardio > 1 || cardio == 0 ? "s" : "")}
              value={cardio}
              obs={
                (cardioTime > 59 ? Math.floor(cardioTime / 60) : cardioTime) +
                (cardioTime === 1
                  ? " Minuto"
                  : cardioTime > 59
                  ? cardioTime / 60 < 2
                    ? " Hora"
                    : " Horas"
                  : " Minutos")
              }
              obsColor={null}
            />
          </CarouselItem>
          <CarouselItem className="p-4 bg-red-400 rounded-lg basis-1/3">
            <WorkoutNumberCard
              label={"km" + (cardioDistance > 1 || cardio == 0 ? "s" : "")}
              value={cardioDistance}
              obs={
                cardioPace
                  ? Math.floor(cardioPace) +
                    ":" +
                    (cardioPace - Math.floor(cardioPace)<10? "0":"")+(cardioPace - Math.floor(cardioPace)) * 60 +
                    " min/km"
                  : null
              }
              obsColor={null}
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default WorkoutNumbers;
