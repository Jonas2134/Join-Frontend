import { http } from "../api/HttpClient";
import { router } from "../core/router";
import { API_ROUTES } from "../api/config";

export class AuthStore {
  private client = http;
  private isRefreshing = false;

  constructor() {
    this.client.setUnauthorizedHandler(this.handleUnauthorized.bind(this));
  }

  async register(username: string, email: string, password: string, repeated_password: string) {
    await this.client.post(API_ROUTES.auth.register, { username, email, password, repeated_password });
  }

  async login(username:string, password:string) {
    await this.client.post(API_ROUTES.auth.login, { username, password });
  }

  async logout() {
    await this.client.post(API_ROUTES.auth.logout);
  }

  async refresh() {
    await this.client.post(API_ROUTES.auth.refresh);
  }

  private async handleUnauthorized() {
    if (this.isRefreshing) return;

    this.isRefreshing = true;

    try {
      await this.refresh();
    } catch {
      router.navigate(`/login`);
    } finally {
      this.isRefreshing = false;
    }
  }
}

export const authStore = new AuthStore();