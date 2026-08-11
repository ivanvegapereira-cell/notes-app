'use client';

import { Note } from '@/lib/types';
import { FileText, CheckSquare, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  notes: Note[];
}

export default function DashboardStats({ notes }: DashboardStatsProps) {
  const stats = {
    totalNotes: notes.filter((n) => n.category === 'note').length,
    totalTasks: notes.filter((n) => n.category === 'task').length,
    completedTasks: notes.filter((n) => n.category === 'task' && n.completed).length,
    totalAgenda: notes.filter((n) => n.category === 'agenda').length,
  };

  const taskCompletionRate =
    stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  const upcomingTasks = notes
    .filter((n) => n.category === 'task' && !n.completed && n.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border-l-4 ${color} hover:shadow-lg transition`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
        <Icon size={32} className={`opacity-20 ${color.replace('border', 'text')}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={FileText}
          label="Notas"
          value={stats.totalNotes}
          color="border-blue-500"
        />
        <StatCard
          icon={CheckSquare}
          label="Tareas"
          value={stats.totalTasks}
          color="border-green-500"
        />
        <StatCard
          icon={Calendar}
          label="Agenda"
          value={stats.totalAgenda}
          color="border-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Completadas"
          value={`${taskCompletionRate}%`}
          color="border-orange-500"
        />
      </div>

      {/* Completion Progress */}
      {stats.totalTasks > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
            Progreso de Tareas
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>
                {stats.completedTasks} de {stats.totalTasks}
              </span>
              <span>{taskCompletionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
            Próximas Tareas
          </h3>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    task.priority === 'high'
                      ? 'bg-red-500'
                      : task.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {new Date(task.dueDate!).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
