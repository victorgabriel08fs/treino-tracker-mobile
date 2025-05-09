import moment from "moment";
import "moment/dist/locale/pt-br";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { Dumbbell, ChevronRight, BicepsFlexed } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { RiMedalFill } from "react-icons/ri";
import {
  getMuscleGroupName,
  getSugestedWorkouts,
  getValidExercises,
  getValidWorkouts,
} from "@/functions";
import { useState } from "react";
import WorkoutCard from "./WorkoutCard";

const SugestedWorkoutCard = ({ title, workout }) => {
  return (
    <div
      className={`block w-full mb-4 animate-scale-in border-b-4 rounded-2xl 
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="font-medium text-card-foreground">{title}</h3>
          </div>
        </div>
      </div>
      <div
        className={`rounded-xl p-4 border border-borderbg-card duration-200 hover:bg-accent transition-all shadow-sm hover:shadow`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="font-medium text-card-foreground">
                {workout.name}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SugestedWorkouts = () => {
  const sugestions = getSugestedWorkouts();
  return (
    <div className="flex px-5 flex-col gap-10">
      <Carousel className="w-full">
        <CarouselPrevious className="ml-2" />
        <CarouselNext className="mr-2" />
        <CarouselContent className="gap-4 px-4">
          {sugestions.map((sugestion) => (
            <CarouselItem className={`p-2  rounded-lg basis-full`}>
              <SugestedWorkoutCard
                title={sugestion.title}
                workout={sugestion.workout}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default SugestedWorkouts;
