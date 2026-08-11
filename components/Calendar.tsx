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

  const getTasksForDate = (date: Date) => {
    return getNotesForDate(date).filter((n) => n.category === 'task' || n.category === 'agenda');
  };

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy', { locale: es }).charAt(0).toUpperCase() +
            format(currentDate, 'MMMM yyyy', { locale: es }).slice(1)}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Mes anterior"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium"
          >
            Hoy
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Próximo mes"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-1">
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
                min-h-24 p-2 rounded-lg border-2 cursor-pointer transition
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                ${isSelected ? 'border-blue-600 bg-blue-100' : ''}
                ${dayNotes.length > 0 ? 'border-green-400' : ''}
                hover:shadow-md
              `}
            >
              {/* Número del día */}
              <div
                className={`
                  text-sm font-bold mb-1
                  ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                  ${isToday ? 'text-blue-600' : ''}
                `}
              >
                {format(day, 'd')}
              </div>

              {/* Notas del día */}
              <div className="space-y-1">
                {dayNotes.slice(0, 2).map((note) => (
                  <div
                    key={note.id}
                    className={`
                      text-xs px-2 py-1 rounded truncate text-white font-medium
                      ${note.category === 'task' ? 'bg-green-500' : 'bg-purple-500'}
                      ${note.priority === 'high' ? 'bg-red-500' : ''}
                    `}
                    title={note.title}
                  >
                    {note.title}
                  </div>
                ))}
                {dayNotes.length > 2 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayNotes.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Hoy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Tarea/Agenda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">Prioridad Alta</span>
        </div>
      </div>
    </div>
  );
}
