import React, { useState } from "react";
import Layout from "../components/Layout";
import WorkoutCard from "../components/WorkoutCard";
import { isSameDay } from "date-fns";
import { CalendarDays, Clock, Filter } from "lucide-react";
import { getSelectedUser, getWorkouts } from "@/storage";
import AddWorkoutButton from "@/components/AddWorkoutButton";
import { getValidWorkouts } from "@/functions";

const WorkoutHistory = () => {
  const [mockWorkouts, setMockWorkouts] = useState(
    getWorkouts(getSelectedUser().id, { sort: true })
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
  });
  const [periods, setPeriods] = useState([]);

  const filteredWorkouts = mockWorkouts.filter((workout) => {
    if (filters.type === "all") return true;
    return workout.workoutType === filters.type;
  });

  const groupedWorkouts = filteredWorkouts.reduce((acc, workout) => {
    // Convertendo a data para UTC para evitar problemas de fuso horário
    const date = new Date(workout.date);

    const monthYear = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getUTCFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(workout);

    return acc;
  }, {});

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
            <p className="text-muted-foreground">Seus treinos anteriores</p>
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="p-2 rounded-full hover:bg-accent"
          >
            <Filter className="h-5 w-5" />
          </button>
        </header>

        {filterOpen && (
          <div className="mb-6 p-4 rounded-lg border border-border animate-slide-down">
            <h2 className="text-sm font-medium mb-3">Filtrar por tipo</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters({ ...filters, type: "all" })}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filters.type === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent"
                }`}
              >
                Todos
              </button>
              {["Força", "Hipertrofia", "Resistência", "Funcional"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setFilters({ ...filters, type })}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filters.type === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(groupedWorkouts).length > 0 ? (
            Object.entries(groupedWorkouts).map(([monthYear, workouts]) => (
              <div key={monthYear}>
                <div className="flex items-center space-x-2 mb-3">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold">{monthYear}</h2>
                </div>
                <div>
                  {workouts.map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      id={workout.id}
                      name={workout.name}
                      date={workout.date}
                      hasCardio={workout?.cardio ? true : false}
                      isToday={isSameDay(workout.date, new Date())}
                      exerciseCount={workout.exerciseCount}
                      workoutType={workout.workoutType}
                      isCompleted={getValidWorkouts([workout]).length > 0}
                      isPending={
                        getValidWorkouts([workout]).length <= 0 &&
                        isSameDay(workout.date, new Date())
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl p-8 border border-dashed border-border flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-accent w-14 h-14 flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                Nenhum treino encontrado
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Não encontramos nenhum treino com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>
      <AddWorkoutButton />
    </Layout>
  );
};

export default WorkoutHistory;
