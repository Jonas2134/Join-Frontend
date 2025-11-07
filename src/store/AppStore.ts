import type { Board, BoardStatus } from "../interfaces/Board";
import { HttpClient } from "../api/HttpClient";

class AppStore {
  private http: HttpClient;
  private boards: Board[] = [];
  private lastFetch: number | null = null;
  private cacheTTL = 60_000;

  constructor() {
    this.http = new HttpClient("https://api.example.com");
  }

  async fetchBoards(force = false): Promise<void> {
    const now = Date.now();
    const isCacheValid = this.lastFetch && now - this.lastFetch < this.cacheTTL;

    if (!force && this.boards.length > 0 && isCacheValid) {
      console.info("Boards aus Cache geladen");
      return;
    }

    console.info("Boards von API geladen");
    this.boards = await this.http.get<Board[]>("/boards/");
    this.lastFetch = now;
  }

  getBoardsByStatus(status: BoardStatus): Board[] {
    return this.boards.filter((board) => board.status === status);
  }

  getBoardById(id: string): Board | undefined {
    return this.boards.find((board) => board.id === id);
  }

  async createBoard(data: Pick<Board, "name" | "description">): Promise<Board> {
    const newBoard = await this.http.post<Board>("/boards/", {
      ...data,
      status: "open",
    });
    this.boards.push(newBoard);
    return newBoard;
  }

  async closeBoard(id: string): Promise<void> {
    await this.http.post(`/boards/${id}/close`, {});
    const board = this.getBoardById(id);
    if (board) board.status = "closed";
  }
}

export const appStore = new AppStore();
