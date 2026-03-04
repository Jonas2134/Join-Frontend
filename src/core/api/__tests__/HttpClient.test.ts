import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { HttpClient } from "../HttpClient";

describe("HttpClient", () => {
  let client: HttpClient;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    client = new HttpClient("http://test-api.example.com");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // GET requests
  // ============================================

  describe("get", () => {
    it("sends GET request with correct URL and credentials", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: "test" }),
      });

      await client.get("/boards/");

      expect(fetchMock).toHaveBeenCalledWith(
        "http://test-api.example.com/boards/",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
        }),
      );
    });

    it("sends GET without body or Content-Type header", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      });

      await client.get("/boards/");

      const callArgs = fetchMock.mock.calls[0][1];
      expect(callArgs.body).toBeUndefined();
      expect(callArgs.headers).toEqual({});
    });

    it("returns parsed JSON response", async () => {
      const mockData = [{ id: "1", title: "Board" }];
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      const result = await client.get("/boards/");

      expect(result).toEqual(mockData);
    });
  });

  // ============================================
  // POST requests
  // ============================================

  describe("post", () => {
    it("sends POST with JSON body and Content-Type header", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ id: "1" }),
      });

      const body = { title: "New Board", description: "Desc" };
      await client.post("/boards/", body);

      expect(fetchMock).toHaveBeenCalledWith(
        "http://test-api.example.com/boards/",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
      );
    });

    it("sends POST without body when none provided", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await client.post("/logout/");

      const callArgs = fetchMock.mock.calls[0][1];
      expect(callArgs.body).toBeUndefined();
      expect(callArgs.headers).toEqual({});
    });
  });

  // ============================================
  // PATCH requests
  // ============================================

  describe("patch", () => {
    it("sends PATCH with JSON body", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1", title: "Updated" }),
      });

      await client.patch("/boards/1/", { title: "Updated" });

      expect(fetchMock).toHaveBeenCalledWith(
        "http://test-api.example.com/boards/1/",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ title: "Updated" }),
        }),
      );
    });
  });

  // ============================================
  // DELETE requests
  // ============================================

  describe("delete", () => {
    it("sends DELETE without body", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 204,
      });

      await client.delete("/boards/1/");

      const callArgs = fetchMock.mock.calls[0][1];
      expect(callArgs.method).toBe("DELETE");
      expect(callArgs.body).toBeUndefined();
    });
  });

  // ============================================
  // 204 No Content
  // ============================================

  describe("204 response", () => {
    it("returns null for 204 status", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await client.delete("/boards/1/");

      expect(result).toBeNull();
    });
  });

  // ============================================
  // 401 Unauthorized retry
  // ============================================

  describe("401 handling", () => {
    it("calls onUnauthorized handler and retries the request on 401", async () => {
      const unauthorizedHandler = vi.fn().mockResolvedValue(undefined);
      client.setUnauthorizedHandler(unauthorizedHandler);

      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ detail: "Unauthorized" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ data: "success" }),
        });

      const result = await client.get("/boards/");

      expect(unauthorizedHandler).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ data: "success" });
    });

    it("throws error on 401 when no unauthorized handler is set", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: "Unauthorized" }),
      });

      await expect(client.get("/boards/")).rejects.toThrow("Unauthorized");
    });

    it("throws error when retry after 401 also fails", async () => {
      const unauthorizedHandler = vi.fn().mockResolvedValue(undefined);
      client.setUnauthorizedHandler(unauthorizedHandler);

      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ detail: "Unauthorized" }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          json: () => Promise.resolve({ detail: "Forbidden" }),
        });

      await expect(client.get("/boards/")).rejects.toThrow("Forbidden");
    });
  });

  // ============================================
  // Error message parsing
  // ============================================

  describe("error message parsing", () => {
    it("uses detail field from error response", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ detail: "Bad request details" }),
      });

      await expect(client.get("/test")).rejects.toThrow("Bad request details");
    });

    it("uses error field from error response", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: "Validation failed" }),
      });

      await expect(client.get("/test")).rejects.toThrow("Validation failed");
    });

    it("uses string response body as error message", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve("Something went wrong"),
      });

      await expect(client.get("/test")).rejects.toThrow(
        "Something went wrong",
      );
    });

    it("stringifies object response without detail or error fields", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({ username: ["This field is required."] }),
      });

      await expect(client.get("/test")).rejects.toThrow(
        '{"username":["This field is required."]}',
      );
    });

    it("falls back to HTTP status when JSON parsing fails", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      await expect(client.get("/test")).rejects.toThrow("HTTP 500");
    });
  });

  // ============================================
  // setUnauthorizedHandler
  // ============================================

  describe("setUnauthorizedHandler", () => {
    it("stores the handler for 401 responses", async () => {
      const handler = vi.fn().mockResolvedValue(undefined);
      client.setUnauthorizedHandler(handler);

      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        });

      await client.get("/test");

      expect(handler).toHaveBeenCalled();
    });
  });
});
