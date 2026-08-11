import { createClient } from '@supabase/supabase-js';
import { Note } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseEnabled = !!supabase;

// CRUD operations
export async function fetchNotes(): Promise<Note[]> {
  if (!supabase) {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  }

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }

  return data || [];
}

export async function createNote(note: Note): Promise<Note | null> {
  if (!supabase) {
    return note;
  }

  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.category,
        created_at: note.createdAt,
        updated_at: note.updatedAt,
        completed: note.completed,
        due_date: note.dueDate,
        priority: note.priority,
        color: note.color,
      },
    ])
    .select();

  if (error) {
    console.error('Error creating note:', error);
    return null;
  }

  return data?.[0] || null;
}

export async function updateNoteInDB(note: Note): Promise<Note | null> {
  if (!supabase) {
    return note;
  }

  const { data, error } = await supabase
    .from('notes')
    .update({
      title: note.title,
      content: note.content,
      category: note.category,
      updated_at: note.updatedAt,
      completed: note.completed,
      due_date: note.dueDate,
      priority: note.priority,
      color: note.color,
    })
    .eq('id', note.id)
    .select();

  if (error) {
    console.error('Error updating note:', error);
    return null;
  }

  return data?.[0] || null;
}

export async function deleteNoteFromDB(id: string): Promise<boolean> {
  if (!supabase) {
    return true;
  }

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting note:', error);
    return false;
  }

  return true;
}
