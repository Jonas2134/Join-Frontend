import { http } from "../api/HttpClient";

class AppStore {
  boards: any[] = [];
  columns: Record<number, any[]> = {};
  tasks: Record<number, any[]> = {};

  constructor() {}

  async loadDashboard() {
    this.boards = await http.get("/boards/");
    return this.boards;
  }

  async createBoard(title: string, description?: string, members?: number) {
    const response = await http.post("/boards/", { title, description, members });
    window.dispatchEvent(new CustomEvent("board:created"));
    return response;
  }
}

export const appStore = new AppStore();
