
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  workoutDates: Date[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

const Calendar = ({ workoutDates, onSelectDate, selectedDate }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentMonth(date => {
      const month = date.getMonth();
      const year = date.getFullYear();
      return new Date(year, month - 1, 1);
    });
  };

  const nextMonth = () => {
    setCurrentMonth(date => {
      const month = date.getMonth();
      const year = date.getFullYear();
      return new Date(year, month + 1, 1);
    });
  };

  const hasWorkout = (date: Date) => {
    return workoutDates.some(workoutDate => isSameDay(workoutDate, date));
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={previousMonth}
            className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextMonth}
            className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
          <div key={i} className="h-8 text-xs font-medium text-muted-foreground flex items-center justify-center">
            {day}
          </div>
        ))}
        {daysInMonth.map((day, i) => {
          const hasWorkoutOnDay = hasWorkout(day);
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={i}
              onClick={() => onSelectDate(day)}
              className={`h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 relative
                ${isSelected ? 'bg-primary text-primary-foreground' : hasWorkoutOnDay ? 'font-medium' : 'hover:bg-accent'}`}
            >
              {format(day, 'd')}
              {hasWorkoutOnDay && (
                <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isSelected ? 'bg-white':'bg-primary'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
