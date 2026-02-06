import { http } from "../api/HttpClient";
import { API_ROUTES } from "../api/config";
import { router } from "../router";
import type { AuthUser, AuthStatusResponse } from "../types/auth.types";

export class AuthStore {
  private client = http;
  private isRefreshing = false;
  currentUser: AuthUser | null = null;

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

  async logout() {
    await this.client.post(API_ROUTES.auth.logout);
    this.currentUser = null;
  }

  async refresh() {
    await this.client.post(API_ROUTES.auth.refresh);
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await this.client.get<AuthStatusResponse>(API_ROUTES.auth.status);
      this.currentUser = response.user;
      return response.is_authenticated;
    } catch {
      this.currentUser = null;
      return false;
    }
  }

  private async handleUnauthorized() {
    if (this.isRefreshing) return;

    this.isRefreshing = true;

    try {
      await this.refresh();
    } catch {
      this.currentUser = null;
      router.navigate(`/login`);
    } finally {
      this.isRefreshing = false;
    }
  }
}

export const authStore = new AuthStore();