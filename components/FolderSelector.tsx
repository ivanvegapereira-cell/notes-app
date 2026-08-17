'use client';

import { Folder } from '@/lib/types';
import { useNotesStore } from '@/lib/store';
import { ChevronDown } from 'lucide-react';

interface FolderSelectorProps {
  selectedFolderId?: string;
  onChange: (folderId: string | undefined) => void;
  className?: string;
}

export default function FolderSelector({ selectedFolderId, onChange, className = '' }: FolderSelectorProps) {
  const { folders } = useNotesStore();

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedFolderId || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
      >
        <option value="">Sin carpeta</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.emoji} {folder.name}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-3 pointer-events-none text-gray-400" />
    </div>
  );
}
