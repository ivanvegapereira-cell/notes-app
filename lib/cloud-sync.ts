import { Note } from './types';

const API_ENDPOINT = '/api/sync';

export class CloudSync {
  static async initCloud(): Promise<boolean> {
    // La API siempre está disponible
    return true;
  }

  static async uploadNotes(notes: Note[]): Promise<boolean> {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes, action: 'sync' }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error uploading to cloud:', error);
      return false;
    }
  }

  static async downloadNotes(): Promise<Note[] | null> {
    try {
      const response = await fetch(API_ENDPOINT);

      if (response.ok) {
        const data = await response.json();
        return data.notes || [];
      }
    } catch (error) {
      console.error('Error downloading from cloud:', error);
    }

    return null;
  }

  static async getCurrentNotes(): Promise<Note[]> {
    const notes = await this.downloadNotes();
    return notes || [];
  }
}

