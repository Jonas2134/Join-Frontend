import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createContact, createUserDetail } from "../../../../tests/helpers/factories";

vi.mock("../../api/HttpClient", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setUnauthorizedHandler: vi.fn(),
  },
}));

import { contactStore } from "../ContactStore";
import { http } from "../../api/HttpClient";

describe("ContactStore", () => {
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    contactStore.contacts = [];
    vi.mocked(http.get).mockReset();
    vi.mocked(http.post).mockReset();
    vi.mocked(http.delete).mockReset();
    dispatchSpy = vi.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loadContacts", () => {
    it("fetches contacts and stores them", async () => {
      const mockContacts = [
        createContact(),
        createContact({ id: 2, username: "contact2" }),
      ];
      vi.mocked(http.get).mockResolvedValue(mockContacts);

      const result = await contactStore.loadContacts();

      expect(http.get).toHaveBeenCalledWith("/contacts/");
      expect(result).toEqual(mockContacts);
      expect(contactStore.contacts).toEqual(mockContacts);
    });
  });

  describe("searchUsers", () => {
    it("sends GET with encoded search query", async () => {
      const mockResults = [createContact({ username: "john" })];
      vi.mocked(http.get).mockResolvedValue(mockResults);

      const result = await contactStore.searchUsers("john doe");

      expect(http.get).toHaveBeenCalledWith("/users/?search=john%20doe");
      expect(result).toEqual(mockResults);
    });

    it("encodes special characters in query", async () => {
      vi.mocked(http.get).mockResolvedValue([]);

      await contactStore.searchUsers("test&user=1");

      expect(http.get).toHaveBeenCalledWith("/users/?search=test%26user%3D1");
    });
  });

  describe("addContact", () => {
    it("sends POST to add contact endpoint", async () => {
      vi.mocked(http.post).mockResolvedValue(undefined);

      await contactStore.addContact("5");

      expect(http.post).toHaveBeenCalledWith("/users/5/add-contact/");
    });

    it("dispatches contact:added event", async () => {
      vi.mocked(http.post).mockResolvedValue(undefined);

      await contactStore.addContact("5");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "contact:added" }),
      );
    });
  });

  describe("removeContact", () => {
    it("sends DELETE and filters local contacts array", async () => {
      contactStore.contacts = [
        createContact({ id: 1, username: "keep" }),
        createContact({ id: 2, username: "remove" }),
        createContact({ id: 3, username: "keep-too" }),
      ];
      vi.mocked(http.delete).mockResolvedValue(undefined);

      await contactStore.removeContact("2");

      expect(http.delete).toHaveBeenCalledWith("/contacts/2/");
      expect(contactStore.contacts).toHaveLength(2);
      expect(contactStore.contacts.map((c) => c.id)).toEqual([1, 3]);
    });

    it("dispatches contact:removed event", async () => {
      contactStore.contacts = [createContact({ id: 1 })];
      vi.mocked(http.delete).mockResolvedValue(undefined);

      await contactStore.removeContact("1");

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "contact:removed" }),
      );
    });
  });

  describe("getUserDetail", () => {
    it("fetches and returns user detail", async () => {
      const mockDetail = createUserDetail({ id: 5 });
      vi.mocked(http.get).mockResolvedValue(mockDetail);

      const result = await contactStore.getUserDetail("5");

      expect(http.get).toHaveBeenCalledWith("/users/5/");
      expect(result).toEqual(mockDetail);
    });
  });
});
