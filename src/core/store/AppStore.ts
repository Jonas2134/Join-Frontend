import { http } from "../api/HttpClient";
import { API_ROUTES } from "../api/config";
import type {
  Boards,
  Board,
  Column,
  ColumnUpdate,
  Task,
  TaskUpdate,
} from "../types/board.types";

class AppStore {
  boards: Boards[] = [];
  singleBoard: Board | null = null;
  columns: Record<number, Column[]> = {};
  tasks: Record<number, Task[]> = {};

  constructor() {}

  async loadDashboard(): Promise<Boards[]> {
    this.boards = await http.get<Boards[]>(API_ROUTES.boards.list);
    return this.boards;
  }

  async createBoard(
    title: string,
    description?: string,
    members?: number[],
  ): Promise<Board> {
    const response = await http.post<Board>(API_ROUTES.boards.list, {
      title,
      description,
      members,
    });
    window.dispatchEvent(new CustomEvent("board:created"));
    return response;
  }

  async loadBoard(id: string): Promise<Board> {
    this.singleBoard = await http.get<Board>(API_ROUTES.boards.detail(id));
    return this.singleBoard;
  }

  async updateBoard(
    boardId: string,
    title?: string,
    description?: string,
    members?: number[],
  ): Promise<Board> {
    const payload: Record<string, unknown> = {};
    if (title !== undefined) payload.title = title;
    if (description !== undefined) payload.description = description;
    if (members !== undefined) payload.members = members;

    const response = await http.patch<Board>(API_ROUTES.boards.detail(boardId), payload);
    window.dispatchEvent(new CustomEvent("board:updated"));
    return response;
  }

  async deleteBoard(boardId: string): Promise<void> {
    await http.delete<void>(API_ROUTES.boards.detail(boardId));
    window.dispatchEvent(new CustomEvent("board:deleted"));
  }

  async archiveBoard(boardId: string, isActive: boolean): Promise<Board> {
    const data = await http.patch<Board>(API_ROUTES.boards.detail(boardId), {
      is_active: isActive,
    });
    window.dispatchEvent(new CustomEvent("board:updated"));
    return data;
  }

  async createColumn(boardId: string, name: string): Promise<Column> {
    const response = await http.post<Column>(API_ROUTES.columns.list(boardId), { name });
    window.dispatchEvent(new CustomEvent("column:created"));
    return response;
  }

  async updateColumn(columnId: string, data: ColumnUpdate): Promise<Column> {
    const response = await http.patch<Column>(API_ROUTES.columns.detail(columnId), data);
    window.dispatchEvent(new CustomEvent("column:updated"));
    return response;
  }

  async deleteColumn(columnId: string): Promise<void> {
    await http.delete<void>(API_ROUTES.columns.detail(columnId));
    window.dispatchEvent(new CustomEvent("column:deleted"));
  }

  async createTask(
    columnId: string,
    title: string,
    description?: string,
    assignee?: number,
  ): Promise<Task> {
    const response = await http.post<Task>(API_ROUTES.tasks.list(columnId), {
      title,
      description,
      assignee,
    });
    window.dispatchEvent(new CustomEvent("task:created"));
    return response;
  }

  async updateTask(taskId: string, data: TaskUpdate): Promise<Task> {
    const response = await http.patch<Task>(API_ROUTES.tasks.detail(taskId), data);
    window.dispatchEvent(new CustomEvent("task:updated"));
    return response;
  }

  async deleteTask(taskId: string): Promise<void> {
    await http.delete<void>(API_ROUTES.tasks.detail(taskId));
    window.dispatchEvent(new CustomEvent("task:deleted"));
  }
}

export const appStore = new AppStore();
