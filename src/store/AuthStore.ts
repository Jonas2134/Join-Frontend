import { http } from "../api/HttpClient";

export class AuthStore {
  private client= http;
  private isRefreshing = false;

  constructor() {
    this.client.setUnauthorizedHandler(this.handleUnauthorized.bind(this));
  }

  async login(username:string, password:string) {
    await this.client.post("/login/", { username, password });
  }

  async logout() {
    await this.client.post("/logout/");
  }

  async refresh() {
    return this.client.post("/token/refresh/");
  }

  private async handleUnauthorized() {
    if (this.isRefreshing) return;

    this.isRefreshing = true;

    try {
      await this.refresh();
    } catch (e) {
      console.warn("Refresh failed => Logout");
      await this.logout();
    } finally {
      this.isRefreshing = false;
    }
  }
}

export const authStore = new AuthStore();