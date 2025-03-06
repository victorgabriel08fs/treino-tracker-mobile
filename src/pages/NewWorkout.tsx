import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Exercise, Workout } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { addWorkout, exerciseAverage, getSelectedUser } from "@/storage";
import moment from "moment";
import BlurImage from "@/components/BlurImage";
import { getWorkoutTypeImage } from "@/functions";

const workoutTypes = [
  { name: "Força", color: "bg-primary" },
  { name: "Hipertrofia", color: "bg-red-600" },
  { name: "Resistência", color: "bg-yellow-500" },
  { name: "Funcional", color: "bg-primary" },
];

const NewWorkout = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(getSelectedUser());

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [workoutType, setWorkoutType] = useState(workoutTypes[0].name);
  const averageExerciseData = exerciseAverage();
  console.log(averageExerciseData);
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: uuidv4(),
      name: "",
      sets: averageExerciseData.setsAverage || 3,
      reps: averageExerciseData.repAverage || 12,
      weight: averageExerciseData.weightAverage || 0,
      isCompleted: false,
    },
  ]);
  const [notes, setNotes] = useState("");

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        sets: averageExerciseData.setsAverage || 3,
        reps: averageExerciseData.repAverage || 12,
        weight: averageExerciseData.weightAverage || 0,
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

    const newWorkout: Workout = {
      id: uuidv4(),
      name: name,
      date: convertedDate,
      duration: duration,
      exerciseCount: exercises.length,
      workoutType: workoutType,
      exercises: exercises,
    };
    addWorkout(selectedUser.id, newWorkout);

    toast.success("Treino salvo com sucesso!");
    navigate(-1);
  };

  return (
    <Layout props={{ hasHeader: true }}>
      <div className="animate-fade-in">
        <div className="relative h-48 -mx-4 mb-5">
          <BlurImage
            src={getWorkoutTypeImage(workoutType)}
            alt="Workout"
            className="h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div
              onClick={() => {
                navigate(-1);
              }}
              className="rounded-full bg-background/80 backdrop-blur-sm p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </div>
          </div>
        </div>
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Novo Treino</h1>
          <p className="text-muted-foreground">Crie seu treino personalizado</p>
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo de Treino</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {workoutTypes.map((type) => (
                  <button
                    key={type.name}
                    type="button"
                    className={`p-2 rounded-md border text-sm transition-all ${
                      workoutType === type.name
                        ? `${type.color} text-primary-foreground`
                        : "bg-card border-border hover:bg-accent"
                    }`}
                    onClick={() => setWorkoutType(type.name)}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
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

export default NewWorkout;
