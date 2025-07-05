import { getValidWorkouts } from "@/functions";
import { isSameDay } from "date-fns";
import moment from "moment";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaMinusCircle,
  FaPlusCircle,
} from "react-icons/fa";
import {
  GiBiceps,
  GiBodyHeight,
  GiChestArmor,
  GiMuscleFat,
  GiWeight,
} from "react-icons/gi";

import { WorkoutIcon } from "./WorkoutIcon";
import { useState } from "react";
const RegisterCard = ({ index, register, undoRegister }) => {
  const userGoals = {
    weight: 80,
    height: 175,
    bodyFatPercent: 10,
    chest: 10,
    arm: 10,
    waist: 10,
    hip: 10,
    thigh: 10,
    calf: 10,
  };
  const [showMoreIntoRegisterCard, setShowMoreIntoRegisterCard] =
    useState(false);
  return (
    <div
      className={`flex flex-col items-center justify-between min-w-24 h-fit px-2 py-2 rounded-lg border border-b-4 bg-amber-100`}
    >
      <div className="font-bold text-xs">
        {moment(register.date).format("DD/MM")}
      </div>
      <div className="font-semibold text-sm max-w-fit text-center flex flex-col items-center break-words overflow-hidden text-ellipsis line-clamp-2">
        <span className="flex flex-row items-center gap-1">
          <GiBodyHeight />
          <p
            className={
              register.height == userGoals.height
                ? "font-bold text-green-500"
                : ""
            }
          >
            {register.height}cm{" "}
          </p>
          {undoRegister && register?.height != undoRegister?.height ? (
            register.height > undoRegister.height ? (
              <FaArrowAltCircleUp
                color={
                  userGoals?.height && userGoals.height >= register.height
                    ? "green"
                    : "red"
                }
              />
            ) : (
              <FaArrowAltCircleDown
                color={
                  userGoals?.height && userGoals.height < register.height
                    ? "green"
                    : "red"
                }
              />
            )
          ) : (
            ""
          )}
        </span>

        <span className="flex flex-row items-center gap-1">
          <GiWeight />
          <p
            className={
              register.weight == userGoals.weight
                ? "font-bold text-green-500"
                : ""
            }
          >
            {register.weight}kg{" "}
          </p>
          {undoRegister && register?.weight != undoRegister?.weight ? (
            register.weight > undoRegister.weight ? (
              <FaArrowAltCircleUp
                color={
                  userGoals?.weight && userGoals.weight >= register.weight
                    ? "green"
                    : "red"
                }
              />
            ) : (
              <FaArrowAltCircleDown
                color={
                  userGoals?.weight && userGoals.weight < register.weight
                    ? "green"
                    : "red"
                }
              />
            )
          ) : (
            ""
          )}
        </span>
        {!showMoreIntoRegisterCard ? (
          <FaPlusCircle
            className="mt-2"
            onClick={() => {
              setShowMoreIntoRegisterCard(index);
            }}
          />
        ) : (
          showMoreIntoRegisterCard == index && (
            <>
              <span className="flex flex-row items-center gap-1">
                <GiMuscleFat />
                {register.bodyFatPercent}%{" "}
                {undoRegister &&
                register?.bodyFatPercent != undoRegister?.bodyFatPercent ? (
                  register.bodyFatPercent > undoRegister.bodyFatPercent ? (
                    <FaArrowAltCircleUp
                      color={
                        userGoals?.bodyFatPercent &&
                        userGoals.bodyFatPercent > register.bodyFatPercent
                          ? "green"
                          : "red"
                      }
                    />
                  ) : (
                    <FaArrowAltCircleDown
                      color={
                        userGoals?.bodyFatPercent &&
                        userGoals.bodyFatPercent < register.bodyFatPercent
                          ? "green"
                          : "red"
                      }
                    />
                  )
                ) : (
                  ""
                )}
              </span>
              {register?.arm && (
                <span className="flex flex-row items-center gap-1">
                  <GiBiceps />
                  {register.arm}cm{" "}
                  {undoRegister && register?.arm != undoRegister?.arm ? (
                    register.arm > undoRegister.arm ? (
                      <FaArrowAltCircleUp
                        color={
                          userGoals?.arm && userGoals.arm > register.arm
                            ? "green"
                            : "red"
                        }
                      />
                    ) : (
                      <FaArrowAltCircleDown
                        color={
                          userGoals?.arm && userGoals.arm < register.arm
                            ? "green"
                            : "red"
                        }
                      />
                    )
                  ) : (
                    ""
                  )}
                </span>
              )}
              {register?.chest && (
                <span className="flex flex-row items-center gap-1">
                  <GiChestArmor />
                  {register.chest}cm{" "}
                  {undoRegister && register?.chest != undoRegister?.chest ? (
                    register.chest > undoRegister.chest ? (
                      <FaArrowAltCircleUp
                        color={
                          userGoals?.chest && userGoals.chest > register.chest
                            ? "green"
                            : "red"
                        }
                      />
                    ) : (
                      <FaArrowAltCircleDown
                        color={
                          userGoals?.chest && userGoals.chest < register.chest
                            ? "green"
                            : "red"
                        }
                      />
                    )
                  ) : (
                    ""
                  )}
                </span>
              )}
              <FaMinusCircle
                className="mt-2"
                onClick={() => {
                  setShowMoreIntoRegisterCard(false);
                }}
              />
            </>
          )
        )}
      </div>
    </div>
  );
};

const ProgressReview = ({ progress }) => {
  progress = [
    {
      date: "2025-03-02",
      weight: 87,
      height: 175,
      bodyFatPercent: 19,
      chest: 10,
      waist: 10,
      hip: 10,
      thigh: 10,
      calf: 10,
      arm: 20,
    },
    {
      date: "2025-03-01",
      weight: 97,
      height: 175,
      bodyFatPercent: 10,
      chest: 10,
      waist: 10,
      hip: 10,
      thigh: 10,
      calf: 10,
    },
    {
      date: "2025-02-01",
      weight: 77,
      height: 175,
      bodyFatPercent: 10,
      chest: 10,
      waist: 10,
      hip: 10,
      thigh: 10,
      calf: 10,
    },
    {
      date: "2025-01-01",
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

  const sortedProgress = progress.sort((a, b) => {
    return moment(a.date).unix() - moment(b.date).unix();
  });

  return (
    <div className="mt-10 mb-10 w-full">
      <h2 className="text-xl font-semibold mb-3">Últimos registros</h2>
      <div className="flex w-full justify-start gap-2 px-2 py-1 overflow-x-auto">
        {sortedProgress.length > 0 ? (
          sortedProgress.map((register, index) => (
            <RegisterCard
              index={index + 1}
              key={register.toString()}
              register={register}
              undoRegister={
                sortedProgress[index - 1] ? sortedProgress[index - 1] : null
              }
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
