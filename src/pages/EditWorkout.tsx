import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Exercise, Workout } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { addWorkout, getWorkout, updateWorkout } from "@/storage";
import moment from "moment";

const workoutTypes = ["Força", "Hipertrofia", "Resistência", "Funcional"];

const EditWorkout = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
    const [mockWorkout, setMockWorkout] = useState<Workout>(
      getWorkout("victor", id)
    );
  const [name, setName] = useState(mockWorkout.name);
  const [date, setDate] = useState(mockWorkout.date);
  const [duration, setDuration] = useState(mockWorkout.duration);
  const [workoutType, setWorkoutType] = useState(mockWorkout.workoutType);
  const [exercises, setExercises] = useState<Exercise[]>(mockWorkout.exercises);
  const [notes, setNotes] = useState(mockWorkout.notes);

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        sets: 3,
        reps: 12,
        weight: 0,
        isCompleted: false,
      },
    ]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((exercise) => exercise.id !== id));
    }
  };

  const updateExercise = (
    id: string,
    field: keyof Exercise,
    value: string | number
  ) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Por favor, dê um nome ao seu treino");
      return;
    }

    if (exercises.some((exercise) => !exercise.name)) {
      toast.error("Todos os exercícios precisam ter um nome");
      return;
    }
    const convertedDate = moment(date).utc().toDate();
    
    const updatedWorkout: Workout = {
      id: id,
      name: name,
      date: convertedDate,
      duration: duration,
      exerciseCount: exercises.length,
      workoutType: workoutType,
      exercises: exercises,
    };
    updateWorkout("victor", updatedWorkout);

    toast.success("Treino salvo com sucesso!");
    navigate(-1);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Treino {mockWorkout.name}</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Treino</Label>
              <Input
                id="name"
                placeholder="Ex: Treino A - Peito e Tríceps"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date">Data do Treino</Label>
              <Input
                id="date"
                type="date"
                value={moment(date).format("YYYY-MM-DD")}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duração do Treino (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                placeholder="Ex: 30 minutos"
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo de Treino</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {workoutTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`p-2 rounded-md border text-sm transition-all ${
                      workoutType === type
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:bg-accent"
                    }`}
                    onClick={() => setWorkoutType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Exercícios</h2>
              <Button
                type="button"
                onClick={addExercise}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>

            <div className="space-y-5">
              {exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="p-4 rounded-lg border border-border bg-card relative"
                >
                  <button
                    type="button"
                    className="absolute top-3 right-3 rounded-full p-1 hover:bg-accent"
                    onClick={() => removeExercise(exercise.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`exercise-${index}-name`}>
                        Nome do Exercício
                      </Label>
                      <Input
                        id={`exercise-${index}-name`}
                        placeholder="Ex: Supino Reto"
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(exercise.id, "name", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`exercise-${index}-sets`}>Séries</Label>
                        <Input
                          id={`exercise-${index}-sets`}
                          type="number"
                          value={exercise.sets}
                          min={1}
                          onChange={(e) =>
                            updateExercise(
                              exercise.id,
                              "sets",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`exercise-${index}-reps`}>
                          Repetições
                        </Label>
                        <Input
                          id={`exercise-${index}-reps`}
                          type="number"
                          value={exercise.reps}
                          min={1}
                          onChange={(e) =>
                            updateExercise(
                              exercise.id,
                              "reps",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`exercise-${index}-weight`}>
                          Peso (kg)
                        </Label>
                        <Input
                          id={`exercise-${index}-weight`}
                          type="number"
                          value={exercise.weight}
                          min={0}
                          step={1}
                          onChange={(e) =>
                            updateExercise(
                              exercise.id,
                              "weight",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione notas sobre este treino..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar Treino
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default EditWorkout;
