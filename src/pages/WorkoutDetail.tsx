import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "sonner";

import ExerciseItem from "../components/ExerciseItem";
import hipertrofia from "../assets/header_images/hipertrofia.jpg";
import forca from "../assets/header_images/forca.jpg";
import resistencia from "../assets/header_images/resistencia.jpg";
import funcional from "../assets/header_images/funcional.jpg";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BlurImage from "../components/BlurImage";
import {
  changeExerciseStatus,
  duplicateWorkout,
  getSelectedUser,
  getWorkout,
  removeWorkout,
  updateWorkout,
} from "@/storage";
import { Exercise, Workout } from "@/types";
import { getMuscleGroupName, getWorkoutTypeImage } from "@/functions";
import SimpleModal from "@/components/SimpleModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const WorkoutConclusionModal = ({ isOpen, onClose, confirmation }) => {
  return (
    <SimpleModal>
      <h3
        className="text-lg leading-6 font-medium text-gray-900"
        id="modal-title"
      >
        Você acaba de concluir o seu treino. Deseja completar informações sobre
        este?
      </h3>
      <div className="flex flex-row mt-4 justify-center items-center gap-4">
        <Button
          className="bg-red-500 border-red-500 font-bold"
          onClick={onClose}
        >
          Não
        </Button>
        <Button
          className="bg-green-500 border-green-500 font-bold"
          onClick={confirmation}
        >
          Sim
        </Button>
      </div>
    </SimpleModal>
  );
};

const WorkoutConclusionFormModal = ({ isOpen, onClose, workout }) => {
  const [realDuration, setRealDuration] = useState(0);
  const handleConclusion = () => {
    workout.realDuration = realDuration;
    updateWorkout(getSelectedUser().id, workout);
    onClose();
    toast.success("Treino concluído!");
  };
  return (
    <SimpleModal>
      <h3
        className="text-lg leading-6 font-medium text-gray-900"
        id="modal-title"
      >
        Treino de {workout.name}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="realDuration">Duração Real do Treino</Label>
          <Input
            id="realDuration"
            type="number"
            placeholder="Ex: 30 minutos"
            onChange={(e) => setRealDuration(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="flex flex-row mt-4 justify-center items-center gap-4">
        <Button
          className="bg-red-500 border-red-500 font-bold"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          className="bg-green-500 border-green-500 font-bold"
          onClick={handleConclusion}
        >
          Salvar
        </Button>
      </div>
    </SimpleModal>
  );
};

const WorkoutDetail = () => {
  const [selectedUser, setSelectedUser] = useState(getSelectedUser());

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [mockWorkout, setMockWorkout] = useState<Workout>(
    getWorkout(selectedUser.id, id)
  );
  const [exercises, setExercises] = useState<Exercise[]>(mockWorkout.exercises);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleCompletion = (exerciseId: string) => {
    const updated = changeExerciseStatus(selectedUser.id, id, exerciseId);
    if (!updated) return;
    setExercises((prevExercises) => {
      const newExercises = prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, isCompleted: !exercise.isCompleted }
          : exercise
      );

      // Agora verifica se todos foram concluídos após a atualização do estado
      if (newExercises.every((ex) => ex.isCompleted)) {
        toast.success("Parabéns, todos os exercícios foram concluídos!");
        if (!mockWorkout.realDuration) {
          setIsConclusionModalOpen(true);
        }
      }

      return newExercises;
    });
  };

  const completedExercises = exercises.filter((ex) => ex.isCompleted).length;
  const progress = (completedExercises / exercises.length) * 100;

  const [isConclusionModalOpen, setIsConclusionModalOpen] = useState(false);
  const [isConclusionFormModalOpen, setIsConclusionFormModalOpen] =
    useState(false);
  const handleConclusionConfirmation = () => {
    setIsConclusionModalOpen(false);
    setIsConclusionFormModalOpen(true);
  };
  const printWorkout = () => {
    const printContent = `
      <html>
        <head>
          <title>Treinamente - Detalhes do Treino - ${mockWorkout.name}</title>
          <style>
            * {
              font-family: Arial, sans-serif !important;
              margin: 0 !important;
              padding: 0 !important;
              box-sizing: border-box !important;
            }
            body {
              padding: 20px !important;
              background-color: #f8fafc !important; /* bg-gray-100 */
              color: #1e293b !important; /* text-slate-800 */
            }
            h1 {
              font-size: 1.75rem !important; /* text-2xl */
              font-weight: bold !important;
              margin-bottom: 10px !important;
            }
            h2 {
              font-size: 1.5rem !important; /* text-xl */
              font-weight: semibold !important;
              margin-top: 20px !important;
              margin-bottom: 10px !important;
            }
            p {
              font-size: 1rem !important; /* text-base */
              margin-bottom: 8px !important;
            }
            .info {
              padding: 8px !important;
              background-color: #e2e8f0 !important; /* bg-gray-200 */
              border-radius: 8px !important; /* rounded-lg */
              margin-bottom: 10px !important;
            }
            ul {
              list-style-type: none !important;
              margin-top: 10px !important;
            }
            li {
              background-color: #fff !important; /* bg-white */
              padding: 12px !important;
              margin-bottom: 8px !important;
              border-radius: 8px !important; /* rounded-lg */
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important; /* shadow */
              font-size: 1rem !important;
            }
            @media print {
              body {
                background-color: white !important;
              }
              .info, li {
                box-shadow: none !important;
                page-break-inside: avoid !important;
              }
            }
          </style>
        </head>
        <body>
          <h1>Treinamente - Detalhes do Treino</h1>
          <h1>${mockWorkout.name}</h1>
          <p class="info"><strong>Data:</strong> ${format(
            mockWorkout.date,
            "d 'de' MMMM",
            { locale: ptBR }
          )}</p>
          ${
            mockWorkout.duration
              ? `<p class="info"><strong>Duração esperada:</strong> ${mockWorkout.duration} minutos</p>`
              : ""
          }
          ${
            mockWorkout.realDuration
              ? `<p class="info"><strong>Duração real:</strong> ${mockWorkout.realDuration} minutos</p>`
              : ""
          }
          ${
            mockWorkout.muscleGroups && mockWorkout.muscleGroups.length > 0
              ? `<p class="info"><strong>Grupos Musculares:</strong> ` +
                mockWorkout.muscleGroups
                  .map((groupId) => getMuscleGroupName(groupId))
                  .join(", ") +
                `</p>`
              : ""
          }
          <h2>Exercícios</h2>
          <ul>
            ${exercises
              .map(
                (ex) => `
              <li>
                <strong>${ex.name}</strong> - ${ex.sets} séries x ${
                  ex.reps
                } reps ${ex.weight ? `(${ex.weight}kg)` : ""}
              </li>
            `
              )
              .join("")}
          </ul>
  
          <script>
            window.onload = function() { window.print(); setTimeout(() => window.close(), 100); }
          </script>
        </body>
      </html>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(printContent);
    newWindow.document.close();
  };

  return (
    <Layout props={{ hasHeader: true }}>
      <div className="animate-fade-in">
        <div className="relative h-48 -mx-4 mb-5">
          <BlurImage
            src={getWorkoutTypeImage(mockWorkout.workoutType)}
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
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-full bg-background/80 backdrop-blur-sm p-2"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50 animate-scale-in">
                  <div className="py-1">
                    <Link
                      to={`/workout/${id}/edit`}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar treino
                    </Link>
                    <button
                      onClick={() => {
                        const duplicatedWorkout = duplicateWorkout(
                          selectedUser.id,
                          id
                        );
                        if (duplicatedWorkout) {
                          navigate(`/workout/${duplicatedWorkout.id}/edit`);
                        }
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar treino
                    </button>
                    <button
                      onClick={() => {
                        printWorkout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </button>
                    <button
                      onClick={() => {
                        removeWorkout(selectedUser.id, id);
                        navigate(-1);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir treino
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{mockWorkout.name}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(mockWorkout.date, "d 'de' MMMM", { locale: ptBR })}
            </div>
            <div className="text-yellow-400 flex items-center">
              <Clock className=" h-4 w-4 mr-1" />
              {mockWorkout.duration} minutos
            </div>
            {mockWorkout.realDuration && (
              <div className="text-blue-400 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {mockWorkout.realDuration} minutos
              </div>
            )}
          </div>
        </div>

        {mockWorkout.muscleGroups && mockWorkout.muscleGroups.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Grupos Musculares</h2>
              <div>
                {mockWorkout.muscleGroups.map(
                  (muscleGroup) =>
                    getMuscleGroupName(muscleGroup) +
                    (muscleGroup !==
                    mockWorkout.muscleGroups[
                      mockWorkout.muscleGroups.length - 1
                    ]
                      ? ", "
                      : "")
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Progresso</h2>
            <span className="text-sm font-medium">
              {completedExercises}/{exercises.length}
            </span>
          </div>
          <div className="h-2 bg-accent rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {mockWorkout.notes && (
          <div className="p-4 rounded-lg bg-accent mb-6">
            <h3 className="text-sm font-medium mb-1">Notas</h3>
            <p className="text-sm text-muted-foreground">{mockWorkout.notes}</p>
          </div>
        )}
        {isConclusionModalOpen && !isConclusionFormModalOpen && (
          <WorkoutConclusionModal
            isOpen={isConclusionModalOpen}
            onClose={() => setIsConclusionModalOpen(false)}
            confirmation={handleConclusionConfirmation}
          />
        )}
        {isConclusionFormModalOpen && !isConclusionModalOpen && (
          <WorkoutConclusionFormModal
            isOpen={isConclusionFormModalOpen}
            onClose={() => setIsConclusionFormModalOpen(false)}
            workout={mockWorkout}
          />
        )}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Exercícios</h2>

          {exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              name={exercise.name}
              sets={exercise.sets}
              reps={exercise.reps}
              weight={exercise.weight}
              isCompleted={exercise.isCompleted}
              onClick={() => toggleCompletion(exercise.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WorkoutDetail;
