import { Note } from './types';

// Usa una URL pública para almacenar datos (alternativa a Supabase)
const CLOUD_STORAGE_URL = 'https://jsonbin.io/api/v3/b'; // Servicio gratuito
const BIN_ID_KEY = 'notes_app_bin_id';

export class CloudSync {
  private static binId: string | null = null;

  static async initCloud(): Promise<string | null> {
    // Intentar obtener bin_id guardado
    const saved = localStorage.getItem(BIN_ID_KEY);
    if (saved) {
      this.binId = saved;
      return saved;
    }

    // Crear nuevo bin
    try {
      const response = await fetch(CLOUD_STORAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-key': '$2b$10$qk4XvM9Z9wQj4X8K7V8j9O1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6'
        },
        body: JSON.stringify({ notes: [] })
      });

      if (response.ok) {
        const data = await response.json();
        const newBinId = data.metadata.id;
        localStorage.setItem(BIN_ID_KEY, newBinId);
        this.binId = newBinId;
        return newBinId;
      }
    } catch (error) {
      console.log('Cloud sync no disponible, usando localStorage local');
    }

    return null;
  }

  static async uploadNotes(notes: Note[]): Promise<boolean> {
    if (!this.binId) {
      const binId = await this.initCloud();
      if (!binId) return false;
    }

    try {
      const response = await fetch(`${CLOUD_STORAGE_URL}/${this.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-key': '$2b$10$qk4XvM9Z9wQj4X8K7V8j9O1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6'
        },
        body: JSON.stringify({ notes, lastSync: new Date().toISOString() })
      });

      return response.ok;
    } catch (error) {
      console.error('Error uploading to cloud:', error);
      return false;
    }
  }

  static async downloadNotes(): Promise<Note[] | null> {
    if (!this.binId) {
      const binId = await this.initCloud();
      if (!binId) return null;
    }

    try {
      const response = await fetch(`${CLOUD_STORAGE_URL}/${this.binId}`, {
        method: 'GET',
        headers: {
          'X-Master-key': '$2b$10$qk4XvM9Z9wQj4X8K7V8j9O1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.record?.notes || [];
      }
    } catch (error) {
      console.error('Error downloading from cloud:', error);
    }

    return null;
  }

  static getBinId(): string | null {
    return this.binId || localStorage.getItem(BIN_ID_KEY);
  }

  static getShareUrl(): string | null {
    const binId = this.getBinId();
    return binId ? `${window.location.origin}?sync=${binId}` : null;
  }
}
