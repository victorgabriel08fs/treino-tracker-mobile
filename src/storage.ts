import { User, Workout } from "./types";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "workout_data";

// Busca os dados do LocalStorage
export const getStoredData = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Salva os dados no LocalStorage
export const saveToLocalStorage = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Adiciona um novo treino para um usuário
export const addWorkout = (username: string, newWorkout: Workout) => {
  const users = getStoredData();
  if (!users.find((user) => user.username === username)) {
    users.push({ id: uuidv4(), username, name: "", email: "", workouts: [] });
  }
  const updatedUsers = users.map((user) =>
    user.username === username
      ? { ...user, workouts: [...user.workouts, newWorkout] }
      : user
  );

  saveToLocalStorage(updatedUsers);
};

// Atualiza um treino existente
export const updateWorkout = (username: string, updatedWorkout: Workout) => {
  const workouts = getWorkouts(username);
  
  const updatedUsers = getStoredData().map((user) => {
    if (user.username === username) {
      const updatedWorkouts = workouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      );
      return { ...user, workouts: updatedWorkouts };
    }
    return user;
  });

  saveToLocalStorage(updatedUsers);
};

export const changeExerciseStatus = (username: string, workoutId: string, exerciseId: string)=>{
  const users = getStoredData();
  const user = users.find((user) => user.username === username);
  if (!user) return;

  const updatedWorkouts = user.workouts.map((workout) => {
    if (workout.id === workoutId) {
      const updatedExercises = workout.exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return { ...exercise, isCompleted: !exercise.isCompleted };
        }
        return exercise;
      });
      return { ...workout, exercises: updatedExercises };
    }
    return workout;
  });

  const updatedUsers = users.map((user) =>
    user.username === username ? { ...user, workouts: updatedWorkouts } : user
  );

  saveToLocalStorage(updatedUsers);

  return true;
}

export const getWorkouts = (username: string, options?: any): Workout[] => {
  const users = getStoredData();
  const user = users.find((user) => user.username === username);
  if (!user) return [];
  const workouts = user.workouts.map((workout) => ({
    ...workout,
    date: new Date(workout.date),
  }));

  if (options?.sort) {
    workouts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }
  return workouts;
};

export const getWorkout = (username: string, workoutId: string) =>
  getWorkouts(username).find((workout) => workout.id === workoutId);

// Remove um treino por ID
export const removeWorkout = (username: string, workoutId: string) => {
  const users = getStoredData();
  const updatedUsers = users.map((user) =>
    user.username === username
      ? { ...user, workouts: user.workouts.filter((w) => w.id !== workoutId) }
      : user
  );

  saveToLocalStorage(updatedUsers);
};
