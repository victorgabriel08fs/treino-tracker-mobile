import hipertrofia from "./assets/header_images/hipertrofia.jpg";
import forca from "./assets/header_images/forca.jpg";
import resistencia from "./assets/header_images/resistencia.jpg";
import funcional from "./assets/header_images/funcional.jpg";
import { Workout } from "./types";
import { muscleGroups } from "./static_data";
import { getSelectedUser, getWorkouts, updateWorkout } from "./storage";
import { get } from "https";

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

export const getThisMonthWorkouts = (workouts: Workout[]) => {
  return workouts.filter(
    (workout) => new Date(workout.date).getMonth() === new Date().getMonth()
  );
};

export const getPastMonthWorkouts = (workouts: Workout[]) => {
  const lastMonth = new Date().getMonth() - 1;
  const lastMonthYear = lastMonth === -1 ? new Date().getFullYear() - 1 : new Date().getFullYear();
  return workouts.filter(
    (workout) => new Date(workout.date).getMonth() === lastMonth && new Date(workout.date).getFullYear() === lastMonthYear
  );
};

export const getPastWeekWorkouts = (workouts: Workout[]) => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() - 7));
  const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

  return workouts.filter(
    (workout) => 
      workout.date >= startOfWeek && workout.date <= endOfWeek
  );
};

export const getThisWeekWorkouts = (workouts: Workout[]) => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

  return workouts.filter(
    (workout) => 
      workout.date >= startOfWeek && workout.date <= endOfWeek
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

const getUnlessMuscleGroup = (validWorkouts) => {
  const muscleGroupsCount = [];
  validWorkouts.map((workout) => {
    workout.muscleGroups.forEach((muscleGroup) => {
      if (getMuscleGroupName(muscleGroup)) {
        if (!muscleGroupsCount.filter((group) => group.id === muscleGroup)[0]) {
          muscleGroupsCount.push({
            id: muscleGroup,
            name: getMuscleGroupName(muscleGroup),
            count: 1,
          });
        } else {
          const index = muscleGroupsCount.findIndex(
            (group) => group.id === muscleGroup
          );
          muscleGroupsCount[index].count += 1;
        }
      }
    });
  });
  muscleGroupsCount.sort((a, b) => a.count - b.count);
  return muscleGroupsCount[0];
};

const getLongestTimeWithoutMuscleGroup = (validWorkouts) => {
  const muscleGroupsCount = [];
  validWorkouts.map((workout) => {
    workout.muscleGroups.forEach((muscleGroup) => {
      if (getMuscleGroupName(muscleGroup)) {
        if (!muscleGroupsCount.filter((group) => group.id === muscleGroup)[0]) {
          muscleGroupsCount.push({
            id: muscleGroup,
            name: getMuscleGroupName(muscleGroup),
            days:
              (new Date().getTime() - workout.date.getTime()) /
              (1000 * 60 * 60 * 24),
          });
        } else {
          const index = muscleGroupsCount.findIndex(
            (group) => group.id === muscleGroup
          );
          const days =
            (new Date().getTime() - workout.date.getTime()) /
            (1000 * 60 * 60 * 24);
          muscleGroupsCount[index].days = Math.max(
            muscleGroupsCount[index].days,
            days
          );
        }
      }
    });
  });
  muscleGroupsCount.sort((a, b) => a.days - b.days);
  return muscleGroupsCount[0];
};

export const getSugestedWorkouts = () => {
  const workouts = getWorkouts(getSelectedUser().id);
  const valid = getValidWorkouts(workouts);

  return [
    {
      title: "Há tempos sem treinar",
      workout: getLongestTimeWithoutMuscleGroup(valid),
    },
    {
      title: "Menos treinado",
      workout: getUnlessMuscleGroup(valid),
    },
  ];
};

export const fixMuscleGroups = () => {
  if (!getSelectedUser()) return;
  const workouts = getWorkouts(getSelectedUser().id);
  workouts.map((workout) => {
    if (workout?.muscleGroups) {
      workout.muscleGroups = workout.muscleGroups.filter(
        (muscleGroup) => !!getMuscleGroupName(muscleGroup)
      );
    }
  });
  const updatedWorkouts = workouts;
  updatedWorkouts.map((workout) => {
    updateWorkout(getSelectedUser().id, workout);
  });
};
