'use client';

import { useNotesStore } from '@/lib/store';
import { Note } from '@/lib/types';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export default function Calendar({ onDateSelect, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const notes = useNotesStore((state) => state.notes);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const weekStart = startOfWeek(monthStart);
  const weekEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getNotesForDate = (date: Date) => {
    return notes.filter((note) => {
      if (!note.dueDate) return false;
      return isSameDay(new Date(note.dueDate), date);
    });
  };

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-3 sm:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
          {format(currentDate, 'MMMM', { locale: es }).charAt(0).toUpperCase() +
            format(currentDate, 'MMMM', { locale: es }).slice(1)}
          <span className="hidden sm:inline text-gray-600 dark:text-gray-400 font-normal ml-2">
            {format(currentDate, 'yyyy')}
          </span>
        </h2>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={prevMonth}
            className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            title="Mes anterior"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition font-medium text-xs sm:text-base"
          >
            Hoy
          </button>
          <button
            onClick={nextMonth}
            className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            title="Próximo mes"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
          <div key={idx} className="text-center font-bold text-gray-800 dark:text-gray-100 py-1 sm:py-2 text-xs sm:text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((day) => {
          const dayNotes = getNotesForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={day.toString()}
              onClick={() => onDateSelect?.(day)}
              className={`
                aspect-square p-1 sm:p-2 rounded-lg sm:rounded-lg border-2 cursor-pointer transition
                flex flex-col items-start justify-between text-xs sm:text-sm
                ${isCurrentMonth ? 'bg-white dark:bg-slate-700' : 'bg-gray-50 dark:bg-slate-800'}
                ${isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 sm:border-blue-500' : 'border-gray-200 dark:border-slate-600'}
                ${isSelected ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/40' : ''}
                ${dayNotes.length > 0 && !isToday ? 'border-green-400' : ''}
                hover:shadow-md active:scale-95 sm:hover:shadow-md sm:min-h-24
              `}
            >
              {/* Número del día */}
              <div
                className={`
                  font-bold
                  ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}
                  ${isToday ? 'text-blue-700 dark:text-blue-300 font-black' : ''}
                  text-xs sm:text-sm
                `}
              >
                {format(day, 'd')}
              </div>

              {/* Indicador de notas */}
              <div className="w-full">
                {dayNotes.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 sm:gap-1">
                    {dayNotes.slice(0, 1).map((note) => (
                      <div
                        key={note.id}
                        className={`
                          w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full
                          ${note.priority === 'high' ? 'bg-red-500' : note.category === 'task' ? 'bg-green-500' : 'bg-purple-500'}
                        `}
                        title={note.title}
                      />
                    ))}
                    {dayNotes.length > 1 && (
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-3 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-slate-600 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-800 dark:text-gray-200 hidden sm:inline">Hoy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded"></div>
          <span className="text-gray-800 dark:text-gray-200 hidden sm:inline">Tarea</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded"></div>
          <span className="text-gray-800 dark:text-gray-200 hidden sm:inline">Prioridad</span>
        </div>
      </div>
    </div>
  );
}
