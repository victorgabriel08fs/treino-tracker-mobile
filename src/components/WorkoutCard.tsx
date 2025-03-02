
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPersonRunning  } from "react-icons/fa6";
import { Dumbbell, ChevronRight, BicepsFlexed } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import moment from 'moment';

interface WorkoutCardProps {
  id: string;
  name: string;
  date: Date;
  exerciseCount: number;
  workoutType: string;
}

interface WorkoutIconProps {
  type: string
}

const WorkoutCard = ({ id, name, date, exerciseCount, workoutType }: WorkoutCardProps) => {
  const WorkoutIcon = ({ type }: WorkoutIconProps) => {
    console.log(type);
    switch (type) {
      case "Força":
        return <Dumbbell className="h-5 w-5 text-primary" />;
      case "Hipertrofia":
        return <BicepsFlexed className="h-5 w-5 text-red-600" />;
      case "Resistência":
        return <FaPersonRunning className="h-5 w-5 text-yellow-500" />;
      case "Funcional":
        return <FaPersonRunning 
        className="h-5 w-5 text-primary" />;
      default:
        return <Dumbbell className="h-5 w-5 text-primary" />;
    }
  }
  date = moment(date).utc().toDate();
  return (
    <Link
      to={`/workout/${id}`}
      className="block w-full mb-4 animate-scale-in"
    >
      <div className="rounded-xl p-4 border border-border bg-card hover:bg-accent transition-all duration-200 shadow-sm hover:shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <WorkoutIcon type={workoutType}/>
            </div>
            <div>
              <h3 className="font-medium text-card-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(date), "d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <span className="text-sm font-medium text-muted-foreground">{workoutType}</span>
              <p className="text-xs text-muted-foreground">{exerciseCount} exercícios</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkoutCard;
