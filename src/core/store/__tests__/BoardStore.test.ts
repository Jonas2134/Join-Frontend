import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createBoards,
  createBoard,
  createColumn,
  createTask,
} from "../../../../tests/helpers/factories";

vi.mock("../../api/HttpClient", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setUnauthorizedHandler: vi.fn(),
  },
}));

import { boardStore } from "../BoardStore";
import { http } from "../../api/HttpClient";

describe("BoardStore", () => {
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    boardStore.boards = [];
    boardStore.singleBoard = null;
    boardStore.columns = {};
    boardStore.tasks = {};

    vi.mocked(http.get).mockReset();
    vi.mocked(http.post).mockReset();
    vi.mocked(http.patch).mockReset();
    vi.mocked(http.delete).mockReset();

    dispatchSpy = vi.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // loadDashboard
  // ============================================

  describe("loadDashboard", () => {
    it("fetches boards and stores them", async () => {
      const mockBoards = [createBoards(), createBoards({ id: "2", title: "Board 2" })];
      vi.mocked(http.get).mockResolvedValue(mockBoards);

      const result = await boardStore.loadDashboard();

      expect(http.get).toHaveBeenCalledWith("/boards/");
      expect(result).toEqual(mockBoards);
      expect(boardStore.boards).toEqual(mockBoards);
    });
  });

  // ============================================
  // createBoard
  // ============================================

  describe("createBoard", () => {
    it("sends POST with board data", async () => {
      const mockBoard = createBoard();
      vi.mocked(http.post).mockResolvedValue(mockBoard);

      const result = await boardStore.createBoard("Test Board", "Description", [1, 2]);

      expect(http.post).toHaveBeenCalledWith("/boards/", {
        title: "Test Board",
        description: "Description",
        members: [1, 2],
      });
      expect(result).toEqual(mockBoard);
    });

    it("dispatches board:created event", async () => {
      vi.mocked(http.post).mockResolvedValue(createBoard());

      await boardStore.createBoard("Test");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "board:created" }),
      );
    });
  });

  // ============================================
  // loadBoard
  // ============================================

  describe("loadBoard", () => {
    it("fetches board by ID and stores it as singleBoard", async () => {
      const mockBoard = createBoard({ id: "42" });
      vi.mocked(http.get).mockResolvedValue(mockBoard);

      const result = await boardStore.loadBoard("42");

      expect(http.get).toHaveBeenCalledWith("/boards/42/");
      expect(result).toEqual(mockBoard);
      expect(boardStore.singleBoard).toEqual(mockBoard);
    });
  });

  // ============================================
  // updateBoard
  // ============================================

  describe("updateBoard", () => {
    it("sends PATCH with only provided fields", async () => {
      const updatedBoard = createBoard({ title: "Updated" });
      vi.mocked(http.patch).mockResolvedValue(updatedBoard);

      await boardStore.updateBoard("1", "Updated");

      expect(http.patch).toHaveBeenCalledWith("/boards/1/", { title: "Updated" });
    });

    it("includes all provided fields in payload", async () => {
      vi.mocked(http.patch).mockResolvedValue(createBoard());

      await boardStore.updateBoard("1", "Title", "Desc", [1, 2]);

      expect(http.patch).toHaveBeenCalledWith("/boards/1/", {
        title: "Title",
        description: "Desc",
        members: [1, 2],
      });
    });

    it("omits undefined fields from payload", async () => {
      vi.mocked(http.patch).mockResolvedValue(createBoard());

      await boardStore.updateBoard("1", undefined, "New desc");

      expect(http.patch).toHaveBeenCalledWith("/boards/1/", {
        description: "New desc",
      });
    });

    it("dispatches board:updated event", async () => {
      vi.mocked(http.patch).mockResolvedValue(createBoard());

      await boardStore.updateBoard("1", "Updated");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "board:updated" }),
      );
    });
  });

  // ============================================
  // deleteBoard
  // ============================================

  describe("deleteBoard", () => {
    it("sends DELETE request", async () => {
      vi.mocked(http.delete).mockResolvedValue(undefined);

      await boardStore.deleteBoard("1");

      expect(http.delete).toHaveBeenCalledWith("/boards/1/");
    });

    it("dispatches board:deleted event", async () => {
      vi.mocked(http.delete).mockResolvedValue(undefined);

      await boardStore.deleteBoard("1");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "board:deleted" }),
      );
    });
  });

  // ============================================
  // archiveBoard
  // ============================================

  describe("archiveBoard", () => {
    it("sends PATCH with is_active flag", async () => {
      vi.mocked(http.patch).mockResolvedValue(createBoard({ is_active: false }));

      await boardStore.archiveBoard("1", false);

      expect(http.patch).toHaveBeenCalledWith("/boards/1/", { is_active: false });
    });

    it("dispatches board:updated event", async () => {
      vi.mocked(http.patch).mockResolvedValue(createBoard());

      await boardStore.archiveBoard("1", true);

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "board:updated" }),
      );
    });
  });

  // ============================================
  // Column CRUD
  // ============================================

  describe("createColumn", () => {
    it("sends POST with column name", async () => {
      const mockColumn = createColumn();
      vi.mocked(http.post).mockResolvedValue(mockColumn);

      const result = await boardStore.createColumn("1", "To Do");

      expect(http.post).toHaveBeenCalledWith("/boards/1/columns/", { name: "To Do" });
      expect(result).toEqual(mockColumn);
    });

    it("dispatches column:created event", async () => {
      vi.mocked(http.post).mockResolvedValue(createColumn());

      await boardStore.createColumn("1", "To Do");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "column:created" }),
      );
    });
  });

  describe("updateColumn", () => {
    it("sends PATCH with column data", async () => {
      const updatedColumn = createColumn({ name: "Done" });
      vi.mocked(http.patch).mockResolvedValue(updatedColumn);

      const result = await boardStore.updateColumn("1", { name: "Done", position: 2 });

      expect(http.patch).toHaveBeenCalledWith("/columns/1/", {
        name: "Done",
        position: 2,
      });
      expect(result).toEqual(updatedColumn);
    });

    it("dispatches column:updated event", async () => {
      vi.mocked(http.patch).mockResolvedValue(createColumn());

      await boardStore.updateColumn("1", { name: "Updated" });

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "column:updated" }),
      );
    });
  });

  describe("deleteColumn", () => {
    it("sends DELETE request", async () => {
      vi.mocked(http.delete).mockResolvedValue(undefined);

      await boardStore.deleteColumn("1");

      expect(http.delete).toHaveBeenCalledWith("/columns/1/");
    });

    it("dispatches column:deleted event", async () => {
      vi.mocked(http.delete).mockResolvedValue(undefined);

      await boardStore.deleteColumn("1");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "column:deleted" }),
      );
    });
  });

  // ============================================
  // Task CRUD
  // ============================================

  describe("createTask", () => {
    it("sends POST with task data", async () => {
      const mockTask = createTask();
      vi.mocked(http.post).mockResolvedValue(mockTask);

      const result = await boardStore.createTask("1", "Task Title", "Task desc", 5);

      expect(http.post).toHaveBeenCalledWith("/columns/1/tasks/", {
        title: "Task Title",
        description: "Task desc",
        assignee: 5,
      });
      expect(result).toEqual(mockTask);
    });

    it("dispatches task:created event", async () => {
      vi.mocked(http.post).mockResolvedValue(createTask());

      await boardStore.createTask("1", "Task");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "task:created" }),
      );
    });
  });

  describe("updateTask", () => {
    it("sends PATCH with task data", async () => {
      const updatedTask = createTask({ title: "Updated Task" });
      vi.mocked(http.patch).mockResolvedValue(updatedTask);

      const result = await boardStore.updateTask("1", { title: "Updated Task", assignee: 3 });

      expect(http.patch).toHaveBeenCalledWith("/tasks/1/", {
        title: "Updated Task",
        assignee: 3,
      });
      expect(result).toEqual(updatedTask);
    });

    it("dispatches task:updated event", async () => {
      vi.mocked(http.patch).mockResolvedValue(createTask());

      await boardStore.updateTask("1", { title: "Updated" });

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "task:updated" }),
      );
    });
  });

  describe("deleteTask", () => {
    it("sends DELETE request", async () => {
      vi.mocked(http.delete).mockResolvedValue(undefined);

      await boardStore.deleteTask("1");

      expect(http.delete).toHaveBeenCalledWith("/tasks/1/");
    });

    it("dispatches task:deleted event", async () => {
      vi.mocked(http.delete).mockResolvedValue(undefined);

      await boardStore.deleteTask("1");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "task:deleted" }),
      );
    });
  });
});
