import React, { useState } from "react";
import Layout from "../components/Layout";
import WorkoutCard from "../components/WorkoutCard";
import WorkoutCharts from "../components/WorkoutCharts";
import Calendar from "../components/Calendar";
import { isSameDay } from "date-fns";
import AddWorkoutButton from "../components/AddWorkoutButton";
import { Dumbbell } from "lucide-react";
import { getSelectedUser, getWorkouts } from "@/storage";
import WorkoutNumbers from "@/components/WorkoutNumbers";
import { getValidWorkouts } from "@/functions";
import { get } from "http";
import WeekReview from "@/components/WeekReview";
import moment from "moment";
import TopThree from "@/components/TopThree";
import { fi } from "date-fns/locale";
import SugestedWorkouts from "@/components/SugestedWorkouts";

const Index = () => {
  const [selectedUser, setSelectedUser] = useState(getSelectedUser());

  const [mockWorkouts, setMockWorkouts] = useState([]);
  if (selectedUser && selectedUser.id) {
    setMockWorkouts(getWorkouts(selectedUser.id));
  }
  const [selectedDate, setSelectedDate] = useState(new Date());
  const workoutDates = mockWorkouts.map((workout) => {
    return {
      date: workout.date,
      isCompleted: getValidWorkouts([workout]).length > 0,
    };
  });
  const weekDates = [];
  weekDates.push(moment().startOf("week"));
  for (let i = 1; i < 7; i++) {
    weekDates.push(moment().startOf("week").add(i, "days"));
  }
  const thisWeekWorkouts = mockWorkouts.filter((workout) => {
    return weekDates.some((date) => isSameDay(date.toDate(), workout.date));
  });

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
                isCompleted={getValidWorkouts([workout]).length > 0}
                isPending={
                  getValidWorkouts([workout]).length <= 0 &&
                  isSameDay(workout.date, new Date())
                }
              />
            ))
          ) : (
            <div className="rounded-xl p-8 border border-dashed border-border flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="rounded-full bg-accent w-14 h-14 flex items-center justify-center mb-3">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                Nenhum treino para{" "}
                {isSameDay(selectedDate, new Date()) ? "hoje" : "este dia"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-4">
                Você não tem nenhum treino cadastrado para esta data. Que tal
                adicionar um?
              </p>
            </div>
          )}
        </div>
        {filteredWorkouts.length === 0 && selectedUser && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-3">Sugestões</h2>
            <SugestedWorkouts />
          </div>
        )}
        <WeekReview workouts={thisWeekWorkouts} weekDates={weekDates} />

        {mockWorkouts.length > 0 && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-3">Alguns números</h2>
              <WorkoutNumbers
                workouts={getWorkouts(selectedUser.id, { sort: true })}
              />
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-3">Top 3 Favoritos</h2>
              <TopThree
                workouts={getWorkouts(selectedUser.id, { sort: true })}
              />
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-3">
                Agora seus gráficos
              </h2>
              <WorkoutCharts
                workouts={getWorkouts(selectedUser.id, { sort: true })}
              />
            </div>
          </div>
        )}
      </div>
      <AddWorkoutButton />
    </Layout>
  );
};

export default Index;
