
import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkoutCardProps {
  id: string;
  name: string;
  date: Date;
  exerciseCount: number;
  workoutType: string;
}

const WorkoutCard = ({ id, name, date, exerciseCount, workoutType }: WorkoutCardProps) => {
  return (
    <Link
      to={`/workout/${id}`}
      className="block w-full mb-4 animate-scale-in"
    >
      <div className="rounded-xl p-4 border border-border bg-card hover:bg-accent transition-all duration-200 shadow-sm hover:shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-card-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">
                {format(date, "d 'de' MMMM", { locale: ptBR })}
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
