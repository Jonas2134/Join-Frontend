export interface Board {
  id: string;
  title: string;
  description?: string;
  members: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
