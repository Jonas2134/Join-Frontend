import { http } from "../api/HttpClient";
import { API_BASE_URL, API_ROUTES } from "../api/config";
import { PUBLIC_ROUTES } from "../constants/publicRoutes.config";
import { router } from "../router";
import type { AuthUser, AuthStatusResponse } from "../types/auth.types";

export class AuthStore {
  private client = http;
  private refreshPromise: Promise<void> | null = null;
  currentUser: AuthUser | null = null;
  isGuest: boolean = false;

  constructor() {
    this.client.setUnauthorizedHandler(this.handleUnauthorized.bind(this));
  }

  async register(username: string, email: string, password: string, repeated_password: string) {
    await this.client.post(API_ROUTES.auth.register, { username, email, password, repeated_password });
  }

  async login(username:string, password:string) {
    await this.client.post(API_ROUTES.auth.login, { username, password });
    await this.checkAuthStatus();
  }

  async guestLogin() {
    await this.client.post(API_ROUTES.auth.guestLogin);
    await this.checkAuthStatus();
  }

  async logout() {
    await this.client.post(API_ROUTES.auth.logout);
    this.currentUser = null;
    this.isGuest = false;
  }

  async refresh() {
    const res = await fetch(API_BASE_URL + API_ROUTES.auth.refresh, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);
  }

  async changePassword(old_password: string, new_password: string, repeated_new_password: string) {
    await this.client.post(API_ROUTES.auth.passwordChange, { old_password, new_password, repeated_new_password });
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await this.client.get<AuthStatusResponse>(API_ROUTES.auth.status);
      this.currentUser = response.user;
      this.isGuest = response.user.is_guest;
      return response.is_authenticated;
    } catch {
      this.currentUser = null;
      return false;
    }
  }

  private async handleUnauthorized() {
    if (!this.refreshPromise) {
      this.refreshPromise = this.refresh()
        .finally(() => { this.refreshPromise = null; });
    }

    try {
      await this.refreshPromise;
    } catch {
      this.currentUser = null;
      if (!PUBLIC_ROUTES.includes(location.pathname)) {
        router.navigate('/login');
      }
      throw new Error('Session expired');
    }
  }
}

export const authStore = new AuthStore();