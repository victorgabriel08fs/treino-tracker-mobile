import { getStoredData, saveToLocalStorage } from "@/storage";
import { User } from "@/types";
import React, { createContext, useContext, useState, useEffect } from "react";

const WorkoutContext = createContext<any>(null);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>(getStoredData());

  useEffect(() => {
    saveToLocalStorage(users);
  }, [users]);

  return (
    <WorkoutContext.Provider value={{ users, setUsers }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
