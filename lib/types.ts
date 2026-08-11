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
}

export interface User {
  id: string;
  email: string;
}
