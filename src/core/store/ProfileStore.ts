import { http } from "../api/HttpClient";
import { API_ROUTES } from "../api/config";
import type { Profile } from "../types/profile.types";

export interface ProfileUpdate {
  email?: string;
  first_name?: string;
  last_name?: string;
  tele_number?: string;
  bio?: string;
}

class ProfileStore {
  profile: Profile | null = null;

  async loadProfile(): Promise<Profile> {
    this.profile = await http.get<Profile>(API_ROUTES.profile);
    window.dispatchEvent(new CustomEvent("profile:loaded"));
    return this.profile;
  }

  async updateProfile(data: ProfileUpdate): Promise<Profile> {
    this.profile = await http.patch<Profile>(API_ROUTES.profile, data);
    window.dispatchEvent(new CustomEvent("profile:updated"));
    return this.profile;
  }
}

export const profileStore = new ProfileStore();
