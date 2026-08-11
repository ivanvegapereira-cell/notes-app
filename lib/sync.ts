import { Note } from './types';
import { supabase, isSupabaseEnabled } from './supabase';

const STORAGE_KEY = 'notes';
const LAST_SYNC_KEY = 'notes_last_sync';
const SYNC_INTERVAL = 30000; // 30 segundos

export class NotesSync {
  private static syncTimer: NodeJS.Timeout | null = null;

  static async initializeSync(store: any) {
    // Cargar datos locales primero
    const localNotes = this.getLocalNotes();
    store.setState({ notes: localNotes });

    // Si Supabase está disponible, sincronizar
    if (isSupabaseEnabled) {
      await this.syncFromSupabase(store);
      this.startAutoSync(store);
    }
  }

  static getLocalNotes(): Note[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  static saveLocalNotes(notes: Note[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  }

  static async syncFromSupabase(store: any) {
    if (!isSupabaseEnabled || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Combinar datos de Supabase con datos locales
        const localNotes = this.getLocalNotes();
        const merged = this.mergeNotes(localNotes, data as Note[]);

        store.setState({ notes: merged });
        this.saveLocalNotes(merged);
      }
    } catch (error) {
      console.error('Error syncing from Supabase:', error);
    }
  }

  static async syncToSupabase(note: Note, operation: 'insert' | 'update' | 'delete') {
    if (!isSupabaseEnabled || !supabase) return;

    try {
      if (operation === 'delete') {
        await supabase.from('notes').delete().eq('id', note.id);
      } else if (operation === 'insert') {
        await supabase.from('notes').insert([this.noteToDb(note)]);
      } else {
        await supabase.from('notes').update(this.noteToDb(note)).eq('id', note.id);
      }
    } catch (error) {
      console.error(`Error syncing ${operation} to Supabase:`, error);
      // Guardar en cola local si falla
      this.queueSyncOperation(note, operation);
    }
  }

  private static noteToDb(note: Note) {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority,
      completed: note.completed,
      due_date: note.dueDate,
      color: note.color,
      created_at: note.createdAt,
      updated_at: note.updatedAt,
    };
  }

  private static mergeNotes(local: Note[], remote: Note[]): Note[] {
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

  private static queueSyncOperation(note: Note, operation: string) {
    const queue = localStorage.getItem('sync_queue') || '[]';
    const operations = JSON.parse(queue);
    operations.push({ note, operation, timestamp: new Date().toISOString() });
    localStorage.setItem('sync_queue', JSON.stringify(operations));
  }

  static async processSyncQueue(store: any) {
    if (!isSupabaseEnabled) return;

    const queue = localStorage.getItem('sync_queue') || '[]';
    const operations = JSON.parse(queue);

    for (const { note, operation } of operations) {
      await this.syncToSupabase(note, operation);
    }

    if (operations.length > 0) {
      localStorage.removeItem('sync_queue');
    }
  }

  static startAutoSync(store: any) {
    if (this.syncTimer) clearInterval(this.syncTimer);

    this.syncTimer = setInterval(async () => {
      await this.syncFromSupabase(store);
      await this.processSyncQueue(store);
    }, SYNC_INTERVAL);
  }

  static stopAutoSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
}
