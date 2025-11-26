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
}

export const appStore = new AppStore();
