export interface Board {
  id: string;
  title: string;
  description?: string;
  members: Member[];
  owner: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  columns: Column[];
}

export interface Member {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  wip_limit: string | null;
  created_at: string;
  updated_at: string;
  tasks: Task[];
}

export interface ColumnUpdate {
  name?: string;
  position?: number;
  wip_limit?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assignee: number | null;
  position: number;
  column: number;
  created_at: string;
  updated_at: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  assignee?: number | null;
  position?: number;
  column?: number;
}
