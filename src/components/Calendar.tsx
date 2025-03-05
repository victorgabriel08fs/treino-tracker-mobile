import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subDays, addDays } from 'date-fns';
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

  const startDayOfWeek = monthStart.getDay(); // 0 = Domingo, 6 = Sábado

  const prevDays = Array.from({ length: startDayOfWeek }, (_, i) =>
    subDays(monthStart, startDayOfWeek - i)
  );

  const totalDays = prevDays.length + daysInMonth.length;
  const nextDays = Array.from({ length: totalDays % 7 ? 7 - (totalDays % 7) : 0 }, (_, i) =>
    addDays(monthEnd, i + 1)
  );

  const calendarDays = [...prevDays, ...daysInMonth, ...nextDays];

  const previousMonth = () => setCurrentMonth(date => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(date => new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const hasWorkout = (date: Date) => workoutDates.some(workoutDate => isSameDay(workoutDate, date));

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex items-center space-x-2">
          <button onClick={previousMonth} className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-accent">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={nextMonth} className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-accent">
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
        {calendarDays.map((day, i) => {
          const hasWorkoutOnDay = hasWorkout(day);
          const isSelected = isSameDay(day, selectedDate);
          const isOtherMonth = day.getMonth() !== currentMonth.getMonth();
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={i}
              onClick={() => onSelectDate(day)}
              className={`h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 relative
                ${isOtherMonth ? 'text-muted' 
                : isSelected ? 'bg-primary text-primary-foreground' 
                : isToday ? 'bg-green-300 text-black font-bold' 
                : hasWorkoutOnDay ? 'font-medium' 
                : 'hover:bg-accent'}`}
              disabled={isOtherMonth}
            >
              {format(day, 'd')}
              {hasWorkoutOnDay && (
                <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
