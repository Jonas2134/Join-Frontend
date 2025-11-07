export interface Board {
  id: string;
  name: string;
  description?: string;
  status: BoardStatus;
  createdAt: string;
  updatedAt: string;
}

export type BoardStatus = 'open' | 'closed';