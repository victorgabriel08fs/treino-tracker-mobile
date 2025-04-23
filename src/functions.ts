import hipertrofia from "./assets/header_images/hipertrofia.jpg";
import forca from "./assets/header_images/forca.jpg";
import resistencia from "./assets/header_images/resistencia.jpg";
import funcional from "./assets/header_images/funcional.jpg";
import { Workout } from "./types";
import { muscleGroups } from "./static_data";
import { getSelectedUser, getWorkouts, updateWorkout } from "./storage";

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

export const getMuscleGroupName = (id: string) => {
  const muscleGroup = muscleGroups.find((group) => group.id === id);
  return muscleGroup ? muscleGroup.name : null;
};

export const muscleGroupMigration = () => {
  let workouts = getWorkouts(getSelectedUser().id);
  workouts = workouts.map((workout) => {
    muscleGroups.forEach((group) => {
      if (workout.name.toLowerCase().includes(group.name.toLowerCase())) {
        if (!workout.muscleGroups) workout.muscleGroups = [];
        workout.muscleGroups.push(group.id);
      }
    });

    // Remove IDs duplicados
    workout.muscleGroups = [...new Set(workout.muscleGroups)];

    updateWorkout(getSelectedUser().id, workout);
    return workout;
  });
};
