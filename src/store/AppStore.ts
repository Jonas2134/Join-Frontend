import { http } from "../api/HttpClient";
import { API_ROUTES } from "../api/config";
import type { ColumnUpdate, TaskUpdate } from "../interfaces/BoardInterface";

class AppStore {
  boards: any[] = [];
  singBoard: any
  columns: Record<number, any[]> = {};
  tasks: Record<number, any[]> = {};

  constructor() {}

  async loadDashboard() {
    this.boards = await http.get(API_ROUTES.boards.list);
    return this.boards;
  }

  async createBoard(title: string, description?: string, members?: number) {
    const response = await http.post(API_ROUTES.boards.list, { title, description, members });
    window.dispatchEvent(new CustomEvent("board:created"));
    return response;
  }

  async loadBoard(id: string) {
    this.singBoard = await http.get(API_ROUTES.boards.detail(id));
    return this.singBoard;
  }

  async createColumn(boardId: string, data: ColumnUpdate) {
    await http.post(API_ROUTES.columns.list(boardId), data);
  }

  async updateColumn(columnId: string, data: ColumnUpdate) {
    await http.patch(API_ROUTES.columns.detail(columnId), data);
  }

  async createTask(columnId: string, title: string, description?: string, assignee?: string) {
    const response = await http.post(API_ROUTES.tasks.list(columnId), { title, description, assignee });
    window.dispatchEvent(new CustomEvent("task:created"));
    return response;
  }

  async updateTask(taskId: string, data: TaskUpdate) {
    await http.patch(API_ROUTES.tasks.detail(taskId), data);
  }
}

export const appStore = new AppStore();
