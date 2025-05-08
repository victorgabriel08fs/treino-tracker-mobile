import moment from "moment";
import "moment/dist/locale/pt-br";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { RiMedalFill } from "react-icons/ri";
import {
  getMuscleGroupName,
  getValidExercises,
  getValidWorkouts,
} from "@/functions";
import { useState } from "react";

const TopThreeCard = ({ title, first, second, third, icon = null }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-center font-bold">{title}</h3>
      <span className="gap-1 items-center text-sm flex ">
        {`1º: ${first}`} <RiMedalFill className="text-yellow-600" />
      </span>
      {second && (
        <span className="gap-1 items-center text-sm flex ">
          {`2º: ${second}`} <RiMedalFill className="text-white" />
        </span>
      )}
      {third && (
        <span className="gap-1 items-center text-sm flex">
          {`3º: ${third}`} <RiMedalFill className="text-amber-700" />
        </span>
      )}
    </div>
  );
};

const TopThree = ({ workouts }) => {
  const getMuscleGroupsTopThree = () => {
    const valid = getValidWorkouts(workouts);
    const muscleGroupsCount = [];
    valid.map((workout) => {
      workout.muscleGroups.forEach((muscleGroup) => {
        if (!muscleGroupsCount.filter((group) => group.id === muscleGroup)[0]) {
          muscleGroupsCount.push({
            id: muscleGroup,
            name: getMuscleGroupName(muscleGroup),
            count: 1,
          });
        } else {
          const index = muscleGroupsCount.findIndex(
            (group) => group.id === muscleGroup
          );
          muscleGroupsCount[index].count += 1;
        }
      });
    });

    muscleGroupsCount.sort((a, b) => b.count - a.count);
    return muscleGroupsCount.splice(0, 3);
  };
  const items = [];

  items.push({
    title: "Grupos Musculares",
    first: getMuscleGroupsTopThree()[0]?.name,
    second: getMuscleGroupsTopThree()[1]?.name,
    third: getMuscleGroupsTopThree()[2]?.name,
    background: "bg-slate-200",
  });
  let basis = "basis-1/3";
  if (items.length === 2) basis = "basis-1/2";
  if (items.length === 1) basis = "basis-full";
  return (
    <div className="flex px-5 flex-col gap-10">
      <Carousel className="w-full">
        <CarouselPrevious className="ml-2" />
        <CarouselNext className="mr-2" />
        <CarouselContent className="gap-4 px-4">
          {items.map((item) => (
            <CarouselItem
              className={`p-2 ${item.background} rounded-lg ${basis}`}
            >
              <TopThreeCard
                title={item.title}
                first={item.first}
                second={item.second ?? null}
                third={item.third ?? null}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TopThree;
