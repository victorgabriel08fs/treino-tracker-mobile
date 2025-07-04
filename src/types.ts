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
  realDuration?: number;
  notes?: string;
  exerciseCount: number;
  workoutType: string;
  exercises: Exercise[];
  muscleGroups?: string[];
  cardio?: {
    type: string;
    duration: number;
    distance: number;
    realDuration?: number;
    realDistance?: number;
    isCompleted: boolean;
  }
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  workouts: Workout[];
};
