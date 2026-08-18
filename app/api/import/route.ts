import { NextRequest, NextResponse } from 'next/server';
import { Note } from '@/lib/types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function parseGoogleCalendar(content: string): Note[] {
  const notes: Note[] = [];

  try {
    const lines = content.split('\n');
    let currentEvent: any = {};

    for (const line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.title = line.replace('SUMMARY:', '').trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.replace('DESCRIPTION:', '').trim();
      } else if (line.startsWith('DTSTART')) {
        const date = line.split(':')[1];
        currentEvent.startDate = new Date(date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)).toISOString();
      } else if (line.startsWith('END:VEVENT')) {
        if (currentEvent.title) {
          notes.push({
            id: generateId(),
            title: currentEvent.title,
            content: currentEvent.description || 'Importado desde Google Calendar',
            category: 'agenda' as const,
            priority: 'medium' as const,
            completed: false,
            isFavorite: false,
            isDeleted: false,
            dueDate: currentEvent.startDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        currentEvent = {};
      }
    }
  } catch (error) {
    console.error('Error parsing Google Calendar:', error);
  }

  return notes;
}

function parseOneNote(content: string): Note[] {
  const notes: Note[] = [];

  try {
    // Parse HTML content from OneNote export
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

    if (titleMatch || bodyMatch) {
      const title = titleMatch ? titleMatch[1].trim() : 'Importado desde OneNote';
      const body = bodyMatch ? bodyMatch[1].replace(/<[^>]*>/g, ' ').trim() : content;

      notes.push({
        id: generateId(),
        title: title,
        content: body.substring(0, 5000),
        category: 'note' as const,
        priority: 'medium' as const,
        completed: false,
        isFavorite: false,
        isDeleted: false,
        dueDate: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error parsing OneNote:', error);
  }

  return notes;
}

function parseSamsungNotes(content: string): Note[] {
  const notes: Note[] = [];

  try {
    // Try JSON format first
    if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
      const data = JSON.parse(content);
      const items = Array.isArray(data) ? data : data.notes || [];

      for (const item of items) {
        notes.push({
          id: generateId(),
          title: item.title || 'Sin título',
          content: item.content || item.text || '',
          category: 'note' as const,
          priority: 'medium' as const,
          completed: false,
          isFavorite: item.pinned || false,
          isDeleted: false,
          dueDate: item.date ? new Date(item.date).toISOString() : undefined,
          createdAt: new Date(item.createdAt || Date.now()).toISOString(),
          updatedAt: new Date(item.updatedAt || Date.now()).toISOString(),
        });
      }
    } else {
      // Parse as plain text - split by lines or markers
      const lines = content.split(/\n\n+/);
      for (const line of lines) {
        if (line.trim()) {
          notes.push({
            id: generateId(),
            title: line.split('\n')[0].substring(0, 100),
            content: line.trim(),
            category: 'note' as const,
            priority: 'medium' as const,
            completed: false,
            isFavorite: false,
            isDeleted: false,
            dueDate: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
  } catch (error) {
    console.error('Error parsing Samsung Notes:', error);
  }

  return notes;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const source = formData.get('source') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const content = await file.text();
    let importedNotes: Note[] = [];

    if (source === 'google-calendar') {
      importedNotes = parseGoogleCalendar(content);
    } else if (source === 'onenote') {
      importedNotes = parseOneNote(content);
    } else if (source === 'samsung-notes') {
      importedNotes = parseSamsungNotes(content);
    } else {
      return NextResponse.json(
        { error: 'Invalid import source' },
        { status: 400 }
      );
    }

    if (importedNotes.length === 0) {
      return NextResponse.json(
        { error: 'No valid notes found in file' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      notes: importedNotes,
      count: importedNotes.length,
    });
  } catch (error) {
    console.error('Error importing:', error);
    return NextResponse.json(
      {
        error: 'Import failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
