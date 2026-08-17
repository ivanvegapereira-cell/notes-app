import { create } from 'zustand';
import { Note, Folder } from './types';
import { NotesSync } from './sync';
import { CloudSync } from './cloud-sync';
import { isSupabaseEnabled } from './supabase';

const STORAGE_KEY = 'notes';
const FOLDERS_KEY = 'folders';
const SYNC_STATUS_KEY = 'notes_sync_status';

interface NotesStore {
  notes: Note[];
  folders: Folder[];
  isSyncing: boolean;
  lastSync: string | null;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  setNotes: (notes: Note[]) => void;
  getNotesByCategory: (category: Note['category']) => Note[];
  getNotesByFolder: (folderId: string) => Note[];
  getTodayTasks: () => Note[];
  filterBySearch: (query: string) => Note[];
  getDeletedNotes: () => Note[];
  getFavoriteNotes: () => Note[];
  moveOverdueTasksToNextDay: () => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string, moveNotesTo?: string) => void;
  setFolders: (folders: Folder[]) => void;
  syncWithCloud: () => Promise<void>;
  setIsSyncing: (syncing: boolean) => void;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  folders: [],
  isSyncing: false,
  lastSync: null,

  addNote: async (note) => {
    set((state) => ({
      notes: [...state.notes, note],
    }));

    const state = get();
    saveToLocalStorage(state.notes);

    // Sincronizar con nube en segundo plano
    syncWithCloud(state.notes);

    if (isSupabaseEnabled) {
      await NotesSync.syncToSupabase(note, 'insert');
    }
  },

  updateNote: async (id, updates) => {
    let updatedNote: Note | undefined;

    set((state) => ({
      notes: state.notes.map((note) => {
        if (note.id === id) {
          updatedNote = {
            ...note,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return updatedNote;
        }
        return note;
      }),
    }));

    const state = get();
    saveToLocalStorage(state.notes);

    // Sincronizar con nube en segundo plano
    syncWithCloud(state.notes);

    if (isSupabaseEnabled && updatedNote) {
      await NotesSync.syncToSupabase(updatedNote, 'update');
    }
  },

  deleteNote: async (id) => {
    const noteToDelete = get().notes.find((n) => n.id === id);

    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              isDeleted: true,
              deletedAt: new Date().toISOString(),
            }
          : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);

    if (isSupabaseEnabled && noteToDelete) {
      await NotesSync.syncToSupabase({ ...noteToDelete, isDeleted: true }, 'update');
    }
  },

  restoreNote: async (id) => {
    const noteToRestore = get().notes.find((n) => n.id === id);

    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              isDeleted: false,
              deletedAt: undefined,
            }
          : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);

    if (isSupabaseEnabled && noteToRestore) {
      await NotesSync.syncToSupabase({ ...noteToRestore, isDeleted: false }, 'update');
    }
  },

  permanentlyDeleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);
  },

  toggleFavorite: (id) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);
  },

  addTag: (id, tag) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, tags: [...(note.tags || []), tag] }
          : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);
  },

  removeTag: (id, tag) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, tags: (note.tags || []).filter((t) => t !== tag) }
          : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);
  },

  setNotes: (notes) => {
    set({ notes });
    saveToLocalStorage(notes);
  },

  getNotesByCategory: (category) => {
    return get().notes.filter((note) => note.category === category && !note.isDeleted);
  },

  getNotesByFolder: (folderId) => {
    return get().notes.filter((note) => note.folderId === folderId && !note.isDeleted);
  },

  getTodayTasks: () => {
    const today = new Date().toDateString();
    return get().notes.filter((note) => {
      if (note.isDeleted) return false;
      if (note.category !== 'task' && note.category !== 'agenda') return false;
      if (!note.dueDate) return false;
      return new Date(note.dueDate).toDateString() === today;
    });
  },

  filterBySearch: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().notes.filter(
      (note) =>
        !note.isDeleted &&
        (note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery))
    );
  },

  getDeletedNotes: () => {
    return get().notes.filter((note) => note.isDeleted);
  },

  getFavoriteNotes: () => {
    return get().notes.filter((note) => note.isFavorite && !note.isDeleted);
  },

  moveOverdueTasksToNextDay: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let hasChanges = false;
    const updatedNotes = get().notes.map((note) => {
      // Solo aplica a tareas incompletas con fecha de vencimiento
      if (
        note.category === 'task' &&
        !note.completed &&
        note.dueDate &&
        !note.isDeleted
      ) {
        const noteDate = new Date(note.dueDate);
        noteDate.setHours(0, 0, 0, 0);

        // Si la fecha de vencimiento es antes de hoy, traspasar al siguiente día
        if (noteDate < today) {
          const nextDay = new Date(noteDate);
          nextDay.setDate(nextDay.getDate() + 1);
          hasChanges = true;

          return {
            ...note,
            dueDate: nextDay.toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      }
      return note;
    });

    if (hasChanges) {
      set({ notes: updatedNotes });
      saveToLocalStorage(updatedNotes);
      syncWithCloud(updatedNotes);
    }
  },

  addFolder: (folder) => {
    set((state) => ({
      folders: [...state.folders, folder],
    }));

    const state = get();
    saveToLocalStorage(state.notes, state.folders);
  },

  updateFolder: (id, updates) => {
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id
          ? {
              ...folder,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : folder
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes, state.folders);
  },

  deleteFolder: (id, moveNotesTo) => {
    const notesToMove = get().notes.filter((n) => n.folderId === id);

    if (moveNotesTo) {
      // Mover notas a otra carpeta
      set((state) => ({
        notes: state.notes.map((note) =>
          note.folderId === id ? { ...note, folderId: moveNotesTo } : note
        ),
        folders: state.folders.filter((folder) => folder.id !== id),
      }));
    } else {
      // Eliminar carpeta y notas
      set((state) => ({
        notes: state.notes.filter((note) => note.folderId !== id),
        folders: state.folders.filter((folder) => folder.id !== id),
      }));
    }

    const state = get();
    saveToLocalStorage(state.notes, state.folders);
  },

  setFolders: (folders) => {
    set({ folders });
    const state = get();
    saveToLocalStorage(state.notes, folders);
  },

  syncWithCloud: async () => {
    const state = get();
    set({ isSyncing: true });

    try {
      // Intentar descargar notas de la nube
      const cloudNotes = await CloudSync.downloadNotes();
      if (cloudNotes && cloudNotes.length > 0) {
        const merged = mergeNotes(state.notes, cloudNotes);
        set({ notes: merged });
        saveToLocalStorage(merged);
      }

      // Subir notas actuales a la nube
      await CloudSync.uploadNotes(state.notes);

      set({ lastSync: new Date().toISOString() });
      localStorage.setItem(SYNC_STATUS_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error syncing with cloud:', error);
    } finally {
      set({ isSyncing: false });
    }
  },

  setIsSyncing: (syncing) => {
    set({ isSyncing: syncing });
  },
}));

// Funciones auxiliares
function saveToLocalStorage(notes: Note[], folders?: Folder[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  if (folders) {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  }
}

export function loadFromLocalStorage(): Note[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function loadFoldersFromLocalStorage(): Folder[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(FOLDERS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function mergeNotes(local: Note[], remote: Note[]): Note[] {
  const merged = new Map<string, Note>();

  // Añadir notas locales
  local.forEach((note) => merged.set(note.id, note));

  // Merge con notas remotas (usar la más reciente)
  remote.forEach((remoteNote) => {
    const localNote = merged.get(remoteNote.id);
    if (!localNote || new Date(remoteNote.updatedAt) > new Date(localNote.updatedAt)) {
      merged.set(remoteNote.id, remoteNote);
    }
  });

  return Array.from(merged.values());
}

async function syncWithCloud(notes: Note[]) {
  // Sincronizar en segundo plano sin bloquear
  setTimeout(async () => {
    try {
      await CloudSync.uploadNotes(notes);
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }, 1000);
}
