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
export const addWorkout = (userId: string, newWorkout: Workout) => {
  const users = getStoredData();
  const updatedUsers = users.map((user) =>
    user.id === userId
      ? { ...user, workouts: [...user.workouts, newWorkout] }
      : user
  );

  saveToLocalStorage(updatedUsers);
};

// Atualiza um treino existente
export const updateWorkout = (userId: string, updatedWorkout: Workout) => {
  const workouts = getWorkouts(userId);

  const updatedUsers = getStoredData().map((user) => {
    if (user.id === userId) {
      const updatedWorkouts = workouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      );
      return { ...user, workouts: updatedWorkouts };
    }
    return user;
  });

  saveToLocalStorage(updatedUsers);
};

export const changeExerciseStatus = (
  userId: string,
  workoutId: string,
  exerciseId: string
) => {
  const users = getStoredData();
  const user = users.find((user) => user.id === userId);
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
    user.id === userId ? { ...user, workouts: updatedWorkouts } : user
  );

  saveToLocalStorage(updatedUsers);

  return true;
};

export const getWorkouts = (userId: string, options?: any): Workout[] => {
  const users = getStoredData();
  const user = users.find((user) => user.id === userId);
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

export const getWorkout = (userId: string, workoutId: string) =>
  getWorkouts(userId).find((workout) => workout.id === workoutId);

// Remove um treino por ID
export const removeWorkout = (userId: string, workoutId: string) => {
  const users = getStoredData();
  const updatedUsers = users.map((user) =>
    user.id === userId
      ? { ...user, workouts: user.workouts.filter((w) => w.id !== workoutId) }
      : user
  );

  saveToLocalStorage(updatedUsers);
};

export const duplicateWorkout = (userId: string, workoutId: string) => {
  const users = getStoredData();
  const user = users.find((user) => user.id === userId);
  if (!user) return;
  const workout = user.workouts.find((workout) => workout.id === workoutId);
  if (!workout) return;

  const newWorkout = { ...workout, id: uuidv4() };
  newWorkout.exercises = newWorkout.exercises.map((exercise) => ({
    ...exercise,
    id: uuidv4(),
    isCompleted: false,
  }));
  const updatedWorkouts = [...user.workouts, newWorkout];

  const updatedUsers = users.map((user) =>
    user.id === userId ? { ...user, workouts: updatedWorkouts } : user
  );

  saveToLocalStorage(updatedUsers);

  return newWorkout;
};

export const getUser = (id: string) => {
  const users = getStoredData();
  return users.find((user) => user.id === id);
};

export const getUsers = () => getStoredData();

export const setSelectedUser = (id: string) => {
  localStorage.setItem("selectedUser", id);
  window.location.reload();
};

export const getSelectedUser = () => {
  const users = getStoredData();
  const id = localStorage.getItem("selectedUser");
  if (!id) return users[0];
  return users.find((user) => user.id === id);
};

export const updateUser = (user: User) => {
  const users = getStoredData();
  const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
  saveToLocalStorage(updatedUsers);
  return user;
};

export const createUser = (user: User) => {
  const users = getStoredData();
  while (users.find((u) => u.id === user.id)) user.id = uuidv4();
  if (users.find((u) => u.email === user.email)) return;
  let slug = user.name.toLowerCase().replace(/ /g, "-");
  slug = slug.replace(/[^\w-]+/g, "");
  const username = slug;
  while (users.find((u) => u.username === slug))
    slug = username + "-" + Math.random().toString(36).substr(2, 3);
  user.username = slug;
  users.push(user);
  saveToLocalStorage(users);
  setSelectedUser(user.id);
  return user;
};

export const exportUserData = () => {
  const selectedUser = getSelectedUser();
  const data = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(selectedUser, null, 2)
  )}`;

  const link = document.createElement("a");
  link.href = data;
  link.download = "workouts.json";
  link.click();

  return true;
};

export const importUserData = (data: string) => {
  const parsedData = JSON.parse(data);

  let users = getStoredData();
  if (!users.find((user) => user.email === parsedData.email)) {
    users.push({
      id: parsedData.id,
      username: parsedData.username,
      name: parsedData.name,
      email: parsedData.email,
      workouts: parsedData.workouts,
    });
  } else {
    users = users.map((user) => {
      if (
        user.email === parsedData.email &&
        confirm(
          `Já existe um usuário com email ${user.email}. Deseja sobreescrever?`
        )
      )
        return parsedData;
      else return user;
    });
  }

  setSelectedUser(parsedData.id);

  saveToLocalStorage(users);

  return true;
};

export const exerciseAverage = () => {
  const selectedUser = getSelectedUser();
  const workouts = getWorkouts(selectedUser.id);

  const getMostFrequent = (arr) => {
    const freqMap = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(freqMap).reduce((a, b) =>
      freqMap[a] > freqMap[b] ? a : b
    );
  };

  const repList = [];
  const weightList = [];
  const setsList = [];

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      repList.push(exercise.reps);
      weightList.push(exercise.weight);
      setsList.push(exercise.sets);
    });
  });

  return {
    repAverage: parseInt(getMostFrequent(repList)),
    weightAverage: parseInt(getMostFrequent(weightList)),
    setsAverage: parseInt(getMostFrequent(setsList)),
  };
};
