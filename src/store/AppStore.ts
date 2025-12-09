import { http } from "../api/HttpClient";
import { API_ROUTES } from "../api/config";

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
}

export const appStore = new AppStore();
