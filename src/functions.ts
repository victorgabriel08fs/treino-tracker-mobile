import hipertrofia from "./assets/header_images/hipertrofia.jpg";
import forca from "./assets/header_images/forca.jpg";
import resistencia from "./assets/header_images/resistencia.jpg";
import funcional from "./assets/header_images/funcional.jpg";
import { Workout } from "./types";

export const getWorkoutTypeImage = (workoutType: string) => {
  switch (workoutType) {
    case "Funcional":
      return funcional;
    case "Força":
      return forca;
    case "Hipertrofia":
      return hipertrofia;
    case "Resistência":
      return resistencia;
    default:
      return forca;
  }
};

export const getValidWorkouts = (workouts: Workout[]) => {
  return workouts.filter(
    (workout) =>
      workout.exercises.filter((exercise) => exercise.isCompleted).length > 0
  );
};

export const getValidExercises = (workouts: Workout[]) => {
  return workouts
    .map((workout) => workout.exercises)
    .flat()
    .filter((exercise) => exercise.isCompleted);
};
