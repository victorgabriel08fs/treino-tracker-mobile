import moment from "moment";
import Chart from "react-apexcharts";
import "moment/dist/locale/pt-br";
import ptBr from "apexcharts/dist/locales/pt-br.json";

const ExercisesChart = ({ data }) => {
  const months = [];
  const exercises = [];
  const workoutTime = [];
  const workoutsCount = [];

  for (let i = 11; i >= 0; i--) {
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
        if (workout.duration) time += workout.duration;
        numberOfWorkouts += 1;
        numberOfExercises += workout.exercises.length;
      }
    });

    exercises.push(numberOfExercises);
    workoutTime.push(time);
    workoutsCount.push(numberOfWorkouts);
  }

  return (
    <>
      <div>Números concretos</div>
      <Chart
        type="line"
        options={{
          chart: {
            id: "numeros-concretos",
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
            name: "Tempo de treino",
            data: workoutTime,
          },
          {
            name: "Número de treinos",
            data: workoutsCount,
          },
        ]}
      />
    </>
  );
};

const WorkoutTypeChart = ({ data }) => {
  const types = [];
  const workoutsPerType = [];
  
  data.map((workout) => {
    if(!types.includes(workout.workoutType)) {
      types.push(workout.workoutType);
      workoutsPerType.push(1);
    } else {
      const index = types.indexOf(workout.workoutType);
      workoutsPerType[index] += 1;
    }
  });

  return (
    <>
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
            defaultLocale: 'pt-br',
          },
          labels: types,
        }}
        series={workoutsPerType}
      />
    </>
  );
};

const WorkoutCharts = ({ workouts }) => {
  return (
    <>
      <ExercisesChart data={workouts} />
      <WorkoutTypeChart data={workouts} />
    </>
  );
};

export default WorkoutCharts;
