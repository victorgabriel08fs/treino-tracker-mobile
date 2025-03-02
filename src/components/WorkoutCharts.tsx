import moment from "moment";
import Chart from "react-apexcharts";
import "moment/dist/locale/pt-br";

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
      <div>ExercisesChart</div>
      <Chart
        type="line"
        options={{
          chart: {
            id: "basic-bar",
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

const WorkoutCharts = ({ exercisesChartData }) => {
  return (
    <>
      <ExercisesChart data={exercisesChartData} />
    </>
  );
};

export default WorkoutCharts;
