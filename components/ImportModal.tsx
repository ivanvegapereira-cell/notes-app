'use client';

import { useState } from 'react';
import { X, Upload, Calendar, BookOpen, Smartphone } from 'lucide-react';
import { Note } from '@/lib/types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (notes: Note[]) => void;
}

type ImportSource = 'google-calendar' | 'onenote' | 'samsung-notes' | null;

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [selectedSource, setSelectedSource] = useState<ImportSource>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('source', selectedSource || '');

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`❌ Error: ${data.error || 'Import failed'}`);
        return;
      }

      onImport(data.notes);
      setMessage(`✅ Importadas ${data.notes.length} notas exitosamente`);

      setTimeout(() => {
        setSelectedSource(null);
        setFile(null);
        onClose();
      }, 2000);
    } catch (error) {
      setMessage('❌ Error de conexión');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📥 Importar Notas
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!selectedSource ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Google Calendar */}
                <button
                  onClick={() => setSelectedSource('google-calendar')}
                  className="p-6 border-2 border-gray-200 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-center"
                >
                  <Calendar size={32} className="mx-auto mb-3 text-blue-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Google Calendar
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Importar eventos del calendario
                  </p>
                </button>

                {/* OneNote */}
                <button
                  onClick={() => setSelectedSource('onenote')}
                  className="p-6 border-2 border-gray-200 dark:border-slate-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition text-center"
                >
                  <BookOpen size={32} className="mx-auto mb-3 text-purple-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    OneNote
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Importar notas de OneNote
                  </p>
                </button>

                {/* Samsung Notes */}
                <button
                  onClick={() => setSelectedSource('samsung-notes')}
                  className="p-6 border-2 border-gray-200 dark:border-slate-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-center"
                >
                  <Smartphone size={32} className="mx-auto mb-3 text-green-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Samsung Notes
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Importar notas de Samsung
                  </p>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  {selectedSource === 'google-calendar'
                    ? 'Importar desde Google Calendar'
                    : selectedSource === 'onenote'
                    ? 'Importar desde OneNote'
                    : 'Importar desde Samsung Notes'}
                </h3>

                {message && (
                  <div
                    className={`p-3 rounded-lg mb-4 ${
                      message.includes('✅')
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {message}
                  </div>
                )}

                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 hover:border-blue-500 transition cursor-pointer">
                    <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Selecciona un archivo
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedSource === 'google-calendar'
                        ? 'Formato: .ics'
                        : selectedSource === 'onenote'
                        ? 'Formato: .html o .docx'
                        : 'Formato: .txt o .json'}
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="hidden"
                    accept={
                      selectedSource === 'google-calendar'
                        ? '.ics'
                        : selectedSource === 'onenote'
                        ? '.html,.docx'
                        : '.txt,.json'
                    }
                  />
                </label>

                {file && (
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Archivo seleccionado: <strong>{file.name}</strong>
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedSource(null);
                    setFile(null);
                    setMessage('');
                  }}
                  disabled={isLoading}
                  className="mt-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ← Volver
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
