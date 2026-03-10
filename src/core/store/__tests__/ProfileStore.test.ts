import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createProfile } from "../../../../tests/helpers/factories";

vi.mock("../../api/HttpClient", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setUnauthorizedHandler: vi.fn(),
  },
}));

import { profileStore } from "../ProfileStore";
import { http } from "../../api/HttpClient";

describe("ProfileStore", () => {
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    profileStore.profile = null;
    vi.mocked(http.get).mockReset();
    vi.mocked(http.patch).mockReset();
    dispatchSpy = vi.spyOn(window, "dispatchEvent");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loadProfile", () => {
    it("fetches profile and stores it", async () => {
      const mockProfile = createProfile();
      vi.mocked(http.get).mockResolvedValue(mockProfile);

      const result = await profileStore.loadProfile();

      expect(http.get).toHaveBeenCalledWith("/profile/");
      expect(result).toEqual(mockProfile);
      expect(profileStore.profile).toEqual(mockProfile);
    });

    it("dispatches profile:loaded event", async () => {
      vi.mocked(http.get).mockResolvedValue(createProfile());

      await profileStore.loadProfile();

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "profile:loaded" }),
      );
    });

    it("propagates errors", async () => {
      vi.mocked(http.get).mockRejectedValue(new Error("Network error"));

      await expect(profileStore.loadProfile()).rejects.toThrow("Network error");
    });
  });

  describe("updateProfile", () => {
    it("sends PATCH with profile data and stores result", async () => {
      const updatedProfile = createProfile({ first_name: "Updated" });
      vi.mocked(http.patch).mockResolvedValue(updatedProfile);

      const result = await profileStore.updateProfile({ first_name: "Updated" });

      expect(http.patch).toHaveBeenCalledWith("/profile/", { first_name: "Updated" });
      expect(result).toEqual(updatedProfile);
      expect(profileStore.profile).toEqual(updatedProfile);
    });

    it("dispatches profile:updated event", async () => {
      vi.mocked(http.patch).mockResolvedValue(createProfile());

      await profileStore.updateProfile({ bio: "New bio" });

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "profile:updated" }),
      );
    });
  });
});
