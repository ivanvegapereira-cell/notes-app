'use client';

import { MeetingDetails, MeetingType } from '@/lib/types';
import { X, Plus } from 'lucide-react';

interface MeetingDetailsFormProps {
  details?: MeetingDetails;
  onChange: (details: MeetingDetails) => void;
}

const MEETING_TYPES: { value: MeetingType; label: string; emoji: string }[] = [
  { value: 'meeting', label: 'Reunión', emoji: '📞' },
  { value: 'presentation', label: 'Presentación', emoji: '🎤' },
  { value: 'brainstorm', label: 'Brainstorm', emoji: '💡' },
  { value: 'retrospective', label: 'Retrospectiva', emoji: '🔍' },
  { value: 'planning', label: 'Planificación', emoji: '📋' },
  { value: 'review', label: 'Revisión', emoji: '✅' },
];

export default function MeetingDetailsForm({ details = {}, onChange }: MeetingDetailsFormProps) {
  const updateDetails = (key: keyof MeetingDetails, value: any) => {
    onChange({ ...details, [key]: value });
  };

  const addAttendee = () => {
    const newAttendees = [...(details.attendees || []), ''];
    updateDetails('attendees', newAttendees);
  };

  const removeAttendee = (index: number) => {
    const newAttendees = details.attendees?.filter((_, i) => i !== index) || [];
    updateDetails('attendees', newAttendees);
  };

  const updateAttendee = (index: number, value: string) => {
    const newAttendees = [...(details.attendees || [])];
    newAttendees[index] = value;
    updateDetails('attendees', newAttendees);
  };

  const addAgendaItem = () => {
    const newAgenda = [...(details.agenda || []), ''];
    updateDetails('agenda', newAgenda);
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = details.agenda?.filter((_, i) => i !== index) || [];
    updateDetails('agenda', newAgenda);
  };

  const updateAgendaItem = (index: number, value: string) => {
    const newAgenda = [...(details.agenda || [])];
    newAgenda[index] = value;
    updateDetails('agenda', newAgenda);
  };

  const addAgreement = () => {
    const newAgreements = [...(details.agreements || []), ''];
    updateDetails('agreements', newAgreements);
  };

  const removeAgreement = (index: number) => {
    const newAgreements = details.agreements?.filter((_, i) => i !== index) || [];
    updateDetails('agreements', newAgreements);
  };

  const updateAgreement = (index: number, value: string) => {
    const newAgreements = [...(details.agreements || [])];
    newAgreements[index] = value;
    updateDetails('agreements', newAgreements);
  };

  return (
    <div className="space-y-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      {/* Tipo de Reunión */}
      <div>
        <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
          Tipo de Reunión
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MEETING_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateDetails('type', type.value)}
              className={`p-2 rounded text-sm font-medium transition ${
                details.type === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600'
              }`}
            >
              {type.emoji} {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duración */}
      <div>
        <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
          Duración (minutos)
        </label>
        <input
          type="number"
          value={details.duration || ''}
          onChange={(e) => updateDetails('duration', e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ej: 60"
        />
      </div>

      {/* Lugar/Link Zoom */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
            Lugar
          </label>
          <input
            type="text"
            value={details.location || ''}
            onChange={(e) => updateDetails('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ej: Oficina 3B"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
            Link Zoom
          </label>
          <input
            type="url"
            value={details.zoomLink || ''}
            onChange={(e) => updateDetails('zoomLink', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://zoom.us/j/..."
          />
        </div>
      </div>

      {/* Asistentes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
            Asistentes
          </label>
          <button
            type="button"
            onClick={addAttendee}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="space-y-2">
          {(details.attendees || []).map((attendee, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={attendee}
                onChange={(e) => updateAttendee(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del asistente"
              />
              <button
                type="button"
                onClick={() => removeAttendee(i)}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Agenda */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
            Puntos de Agenda
          </label>
          <button
            type="button"
            onClick={addAgendaItem}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="space-y-2">
          {(details.agenda || []).map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateAgendaItem(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Punto de agenda"
              />
              <button
                type="button"
                onClick={() => removeAgendaItem(i)}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Acuerdos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
            Acuerdos y Decisiones
          </label>
          <button
            type="button"
            onClick={addAgreement}
            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center gap-1"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="space-y-2">
          {(details.agreements || []).map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateAgreement(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acuerdo o decisión"
              />
              <button
                type="button"
                onClick={() => removeAgreement(i)}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
