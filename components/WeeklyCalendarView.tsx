'use client';

import { useNotesStore } from '@/lib/store';
import { Note } from '@/lib/types';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  parse,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface WeeklyCalendarViewProps {
  currentDate: Date;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MEETING_COLORS: Record<string, string> = {
  'meeting': 'bg-blue-500',
  'presentation': 'bg-purple-500',
  'brainstorm': 'bg-yellow-500',
  'retrospective': 'bg-pink-500',
  'planning': 'bg-green-500',
  'review': 'bg-indigo-500',
  'task': 'bg-orange-500',
  'agenda': 'bg-cyan-500',
};

export default function WeeklyCalendarView({
  currentDate,
  onDateSelect,
  selectedDate,
  onPrevWeek,
  onNextWeek,
}: WeeklyCalendarViewProps) {
  const notes = useNotesStore((state) => state.notes);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getNotesForDateAndHour = (date: Date, hour: number) => {
    return notes.filter((note) => {
      if (!note.dueDate) return false;
      const noteDate = new Date(note.dueDate);
      if (!isSameDay(noteDate, date)) return false;
      const noteHour = noteDate.getHours();
      return noteHour === hour;
    });
  };

  const getMeetingColor = (note: Note): string => {
    if (note.meetingDetails?.type) {
      return MEETING_COLORS[note.meetingDetails.type] || 'bg-gray-500';
    }
    return MEETING_COLORS[note.category] || 'bg-gray-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-3 sm:p-6 w-full overflow-x-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
          Semana de {format(weekStart, 'd MMM', { locale: es })}
        </h2>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={onPrevWeek}
            className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            title="Semana anterior"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onNextWeek}
            className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
            title="Próxima semana"
          >
            <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Weekly grid */}
      <div className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-8 bg-gray-50 dark:bg-slate-700">
          <div className="p-2 sm:p-3 border-r border-gray-200 dark:border-slate-600 font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-100">
            Hora
          </div>
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            return (
              <div
                key={day.toString()}
                onClick={() => onDateSelect?.(day)}
                className={`p-2 sm:p-3 border-r border-gray-200 dark:border-slate-600 font-bold text-xs sm:text-sm text-center cursor-pointer transition ${
                  isToday ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''
                } ${isSelected ? 'bg-blue-200 dark:bg-blue-900/50' : 'text-gray-800 dark:text-gray-100'}`}
              >
                <div>{format(day, 'EEE', { locale: es }).toUpperCase()}</div>
                <div>{format(day, 'd')}</div>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-t border-gray-200 dark:border-slate-600 min-h-12">
            {/* Hour label */}
            <div className="p-2 sm:p-3 border-r border-gray-200 dark:border-slate-600 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 text-center">
              {String(hour).padStart(2, '0')}:00
            </div>

            {/* Day cells */}
            {weekDays.map((day) => {
              const dayNotes = getNotesForDateAndHour(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className="p-1 sm:p-2 border-r border-gray-200 dark:border-slate-600 relative min-h-12"
                >
                  {dayNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`
                        ${getMeetingColor(note)} text-white text-xs rounded px-1 sm:px-2 py-1 mb-1
                        cursor-pointer hover:opacity-80 transition truncate
                      `}
                      title={note.title}
                    >
                      {note.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-slate-600">
        <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">Tipos de reunión:</p>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          {Object.entries(MEETING_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 ${color} rounded`}></div>
              <span className="text-gray-700 dark:text-gray-300 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
