'use client';

import { useNotesStore } from '@/lib/store';
import { ChevronDown, ChevronRight, FolderPlus } from 'lucide-react';
import { useState } from 'react';

interface FolderSectionProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onOpenFolderManager: () => void;
}

export default function FolderSection({
  activeCategory,
  onCategoryChange,
  onOpenFolderManager,
}: FolderSectionProps) {
  const { folders, getNotesByFolder } = useNotesStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newSet = new Set(expandedFolders);
    if (newSet.has(folderId)) {
      newSet.delete(folderId);
    } else {
      newSet.add(folderId);
    }
    setExpandedFolders(newSet);
  };

  // Siempre mostrar la sección, incluso sin carpetas

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Carpetas
        </h3>
        <button
          onClick={onOpenFolderManager}
          className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-gray-600 dark:text-gray-400"
          title="Gestionar carpetas"
        >
          <FolderPlus size={16} />
        </button>
      </div>

      <div className="space-y-1">
        {folders.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 px-4 py-2">
            No hay carpetas. Crea una para organizar tus notas.
          </p>
        )}
        {folders.map((folder) => {
          const notesCount = getNotesByFolder(folder.id).length;
          const isActive = activeCategory === `folder:${folder.id}`;
          const isExpanded = expandedFolders.has(folder.id);

          return (
            <div key={folder.id}>
              <button
                onClick={() => onCategoryChange(`folder:${folder.id}`)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{folder.emoji}</span>
                <span className="flex-1 text-left">{folder.name}</span>
                <span className="text-xs bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full">
                  {notesCount}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
