export type MeetingType = 'meeting' | 'presentation' | 'brainstorm' | 'retrospective' | 'planning' | 'review';

export interface MeetingDetails {
  type?: MeetingType;
  attendees?: string[];
  location?: string;
  zoomLink?: string;
  duration?: number;
  agenda?: string[];
  agreements?: string[];
  followUps?: Array<{ task: string; owner?: string; dueDate?: string }>;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  color?: string;
  emoji?: string;
  createdAt: string;
  updatedAt: string;
  notesCount?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'note' | 'task' | 'agenda';
  createdAt: string;
  updatedAt: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  color?: string;
  isFavorite?: boolean;
  tags?: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  folderId?: string;
  meetingDetails?: MeetingDetails;
}

export interface User {
  id: string;
  email: string;
}
