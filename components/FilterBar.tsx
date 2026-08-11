'use client';

import { Filter, SortAsc } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
}

export interface FilterState {
  priority: 'all' | 'high' | 'medium' | 'low';
  status: 'all' | 'completed' | 'pending';
}

export type SortOption = 'newest' | 'oldest' | 'dueDate' | 'priority';

export default function FilterBar({ onFilterChange, onSortChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({ priority: 'all', status: 'all' });
  const [sort, setSort] = useState<SortOption>('newest');
  const [isOpen, setIsOpen] = useState(false);

  const handlePriorityChange = (priority: FilterState['priority']) => {
    const newFilters = { ...filters, priority };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (status: FilterState['status']) => {
    const newFilters = { ...filters, status };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    onSortChange(newSort);
  };

  const priorityLabels = {
    all: 'Todas',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };

  const statusLabels = {
    all: 'Todas',
    completed: 'Completadas',
    pending: 'Pendientes',
  };

  const sortLabels = {
    newest: 'Más recientes',
    oldest: 'Más antiguas',
    dueDate: 'Fecha vencimiento',
    priority: 'Por prioridad',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <div>
            <label className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase">
              Prioridad
            </label>
            <div className="flex gap-2 mt-1">
              {(['all', 'high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    filters.priority === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {priorityLabels[p]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase">
              Estado
            </label>
            <div className="flex gap-2 mt-1">
              {(['all', 'completed', 'pending'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    filters.status === s
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase flex items-center gap-1 mb-1">
            <SortAsc size={14} />
            Ordenar
          </label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
              <option key={opt} value={opt}>
                {sortLabels[opt]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
