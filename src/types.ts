export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  isCompleted: boolean;
};

export type Workout = {
  id: string;
  name: string;
  date: Date; 
  duration?: number;
  notes?: string;
  exerciseCount: number;
  workoutType: string;
  exercises: Exercise[];
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  workouts: Workout[];
};
