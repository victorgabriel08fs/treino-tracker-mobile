
import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface ExerciseItemProps {
  type: string;
  distance: number;
  duration: number;
  isCompleted?: boolean;
  onClick?: () => void;
}

const CardioItem = ({ type, distance, duration, isCompleted = false, onClick }: ExerciseItemProps) => {
  return (
    <div 
      className={`p-4 rounded-lg border ${
        isCompleted ? 'bg-accent/50 border-accent' : 'bg-card border-border'
      } mb-3 transition-all duration-200`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
            isCompleted ? 'bg-primary' : 'border border-muted-foreground'
          }`}>
            {isCompleted && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">{type}</h3>
            <p className="text-xs text-muted-foreground">
              {distance} (km) • {duration} (min)
            </p>
          </div>
        </div>
        {onClick && (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
    </div>
  );
};

export default CardioItem;
