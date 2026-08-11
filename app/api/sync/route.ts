import { NextRequest, NextResponse } from 'next/server';
import { Note } from '@/lib/types';

// Almacenar notas en memoria (en producción usarías una DB)
let globalNotes: Note[] = [];
let lastUpdate = new Date();

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      notes: globalNotes,
      timestamp: lastUpdate.toISOString(),
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notes, action } = body;

    if (action === 'sync' && Array.isArray(notes)) {
      // Mergear notas con deduplicación
      const noteMap = new Map<string, Note>();

      // Añadir notas existentes
      globalNotes.forEach((note) => noteMap.set(note.id, note));

      // Mergear con notas nuevas (usar la más reciente)
      notes.forEach((note: Note) => {
        const existing = noteMap.get(note.id);
        if (!existing || new Date(note.updatedAt) > new Date(existing.updatedAt)) {
          noteMap.set(note.id, note);
        }
      });

      globalNotes = Array.from(noteMap.values());
      lastUpdate = new Date();

      return NextResponse.json({
        notes: globalNotes,
        timestamp: lastUpdate.toISOString(),
        success: true,
      });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Error syncing notes' }, { status: 500 });
  }
}
