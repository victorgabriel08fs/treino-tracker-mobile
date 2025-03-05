import React, { useState } from "react";
import Layout from "../components/Layout";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutCharts from "../components/WorkoutCharts";
import Calendar from "../components/Calendar";
import AddWorkoutButton from "../components/AddWorkoutButton";
import { Dumbbell } from "lucide-react";
import { getSelectedUser, getWorkouts } from "@/storage";

const Index = () => {
  const [selectedUser, setSelectedUser] = useState(getSelectedUser());

  const [mockWorkouts, setMockWorkouts] = useState(getWorkouts(selectedUser.username));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const workoutDates = mockWorkouts.map((workout) => workout.date);

  const filteredWorkouts = mockWorkouts.filter(
    (workout) =>
      workout.date.getDate() === selectedDate.getDate() &&
      workout.date.getMonth() === selectedDate.getMonth() &&
      workout.date.getFullYear() === selectedDate.getFullYear()
  );

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Meus Treinos</h1>
        </header>

        <Calendar
          workoutDates={workoutDates}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-3">Treinos do dia</h2>

          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                id={workout.id}
                name={workout.name}
                date={workout.date}
                isToday={false}
                exerciseCount={workout.exerciseCount}
                workoutType={workout.workoutType}
              />
            ))
          ) : (
            <div className="rounded-xl p-8 border border-dashed border-border flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="rounded-full bg-accent w-14 h-14 flex items-center justify-center mb-3">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Nenhum treino hoje</h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-4">
                Você não tem nenhum treino cadastrado para esta data. Que tal
                adicionar um?
              </p>
            </div>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-3">Algumas estatísticas</h2>
          <WorkoutCharts workouts={getWorkouts(selectedUser.username, { sort: true })} />
        </div>
      </div>
      <AddWorkoutButton />
    </Layout>
  );
};

export default Index;
