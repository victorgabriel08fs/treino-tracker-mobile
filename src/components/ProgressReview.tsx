import { getValidWorkouts } from "@/functions";
import { isSameDay } from "date-fns";
import moment from "moment";
import { WorkoutIcon } from "./WorkoutIcon";
const RegisterCard = ({ register, undoRegister }) => {
  return (
    <div
      className={`flex flex-col items-center justify-between min-w-24 h-32 px-2 py-2 rounded-lg border border-b-4 bg-amber-100`}
    >
      <div className="font-bold text-xs">{register.date}</div>
      <div className="font-semibold text-sm max-w-20 text-center break-words overflow-hidden text-ellipsis line-clamp-2">
        {"Sem treino"}
      </div>
    </div>
  );
};

const ProgressReview = ({ progress }) => {
  progress = [
    {
      date: new Date(),
      weight: 67,
      height: 175,
      bodyFatPercent: 10,
      chest: 10,
      waist: 10,
      hip: 10,
      thigh: 10,
      calf: 10,
    },
    {
      date: new Date(),
      weight: 67,
      height: 175,
      bodyFatPercent: 10,
      chest: 10,
      waist: 10,
      hip: 10,
      thigh: 10,
      calf: 10,
    },
    {
      date: new Date(),
      weight: 67,
      height: 175,
      bodyFatPercent: 10,
      chest: 10,
      waist: 10,
      hip: 10,
      thigh: 10,
      calf: 10,
    },
  ];
  return (
    <div className="mt-10 mb-10 w-full">
      <h2 className="text-xl font-semibold mb-3">Para esta semana</h2>
      <div className="flex w-full justify-between gap-2 px-2 py-1 overflow-x-auto">
        {progress.length > 0 ? (
          progress.map((register) => (
            <RegisterCard
              key={register.toString()}
              register={register}
              undoRegister={register}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-between w-full h-32 px-2 py-2 rounded-lg border border-b-4 border-b-gray-500 bg-amber-100">
            <div className="font-bold text-xs">Sem registros</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressReview;
