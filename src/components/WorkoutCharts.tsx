import moment from "moment";
import Chart from "react-apexcharts";
import "moment/dist/locale/pt-br";
import ptBr from "apexcharts/dist/locales/pt-br.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { useState } from "react";

const ExercisesChart = ({ data, period }) => {
  const months = [];
  const exercises = [];
  const workoutTime = [];
  const workoutsCount = [];

  for (let i = period - 1; i >= 0; i--) {
    const month = moment().subtract(i, "months");
    months.push(month.locale("pt-br").format("MMM"));
    let numberOfExercises = 0;
    let numberOfWorkouts = 0;
    let time = 0;
    data.forEach((workout) => {
      const workoutDate = moment(workout.date); // Converte a data
      if (
        workoutDate.month() === month.month() &&
        workoutDate.year() === month.year()
      ) {
        if (
          workout.exercises &&
          workout.exercises.filter((exercise) => exercise.isCompleted).length >
            0
        ) {
          if (workout.duration) time += workout.duration;
          numberOfWorkouts += 1;
          if (workout.exercises)
            numberOfExercises += workout.exercises.filter(
              (exercise) => exercise.isCompleted
            ).length;
        }
      }
    });

    exercises.push(numberOfExercises);
    workoutTime.push(time);
    workoutsCount.push(numberOfWorkouts);
  }

  return (
    <div>
      <div>Números concretos</div>
      <Chart
        type="bar"
        options={{
          chart: {
            id: "numeros-concretos",
            locales: [ptBr],
            defaultLocale: "pt-br",
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: true,
                zoomin: false,
                reset: false,
                zoom: false,
                pan: false,
                zoomout: false,
              },
            },
          },
          xaxis: {
            categories: months,
          },
        }}
        series={[
          {
            name: "Número de exercícios",
            data: exercises,
          },
          {
            name: "Número de treinos",
            data: workoutsCount,
          },
        ]}
      />
    </div>
  );
};

const CardioDistanceTimeChart = ({ data, period }) => {
  const months = [];
  const times = [];
  const distances = [];

  for (let i = period - 1; i >= 0; i--) {
    const month = moment().subtract(i, "months");
    months.push(month.locale("pt-br").format("MMM"));
    let distance = 0;
    let time = 0;
    data.forEach((workout) => {
      const workoutDate = moment(workout.date);
      if (
        workoutDate.month() === month.month() &&
        workoutDate.year() === month.year()
      ) {
        if (
          workout?.cardio &&
          workout?.cardio?.isCompleted
        ) {
          if (workout?.cardio?.duration) time += workout?.cardio?.realDuration;
          if (workout?.cardio?.distance) distance += workout?.cardio?.realDistance;
        }
      }
    });

    distances.push(distance);
    times.push(time);
  }

  return (
    <div>
      <div>Progresso de Cardio</div>
      <Chart
        type="line"
        options={{
          chart: {
            id: "numeros-concretos-cardio",
            locales: [ptBr],
            defaultLocale: "pt-br",
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: true,
                zoomin: false,
                reset: false,
                zoom: false,
                pan: false,
                zoomout: false,
              },
            },
          },
          xaxis: {
            categories: months,
          },
        }}
        series={[
          {
            name: "Distância percorrida (km)",
            data: distances,
            color: "#FF0000",
          },
          {
            name: "Tempo de treino (min)",
            data: times,
            color: "#0000FF",
          },
        ]}
      />
    </div>
  );
};

const WorkoutTypeChart = ({ data, period }) => {
  const types = [];
  const workoutsPerType = [];
  const initialMonth = moment().subtract(period, "months").startOf("month");
  data = data.filter((workout) => moment(workout.date).isAfter(initialMonth));
  data.map((workout) => {
    if (!types.includes(workout.workoutType)) {
      types.push(workout.workoutType);
      workoutsPerType.push(1);
    } else {
      const index = types.indexOf(workout.workoutType);
      workoutsPerType[index] += 1;
    }
  });

  return (
    <div>
      <div>Distribuição de treino</div>
      <Chart
        type="pie"
        options={{
          chart: {
            id: "tipos-de-treino",
            toolbar: {
              show: true,
            },
            locales: [ptBr],
            defaultLocale: "pt-br",
          },
          labels: types,
        }}
        series={workoutsPerType}
      />
    </div>
  );
};

const WorkoutCharts = ({ workouts }) => {
  const [period, setPeriod] = useState(3);
  return (
    <div className="flex px-5 flex-col gap-10">
      <div>
        <select
          className="select select-bordered w-full max-w-xs"
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value={3}>Últimos 3 meses</option>
          <option value={6}>Últimos 6 meses</option>
          <option value={12}>Último 1 ano</option>
        </select>
      </div>
      <Carousel
        className="w-full max-w-lg mx-auto"
        opts={{ slidesToScroll: 1 }}
      >
        <CarouselContent>
          <CarouselItem className="basis-full">
            <ExercisesChart period={period} data={workouts} />
          </CarouselItem>
          <CarouselItem className="basis-full">
            <CardioDistanceTimeChart period={period} data={workouts} />
          </CarouselItem>
          <CarouselItem className="basis-full">
            <WorkoutTypeChart data={workouts} period={period} />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="ml-2" />
        <CarouselNext className="mr-2" />
      </Carousel>
    </div>
  );
};

export default WorkoutCharts;
