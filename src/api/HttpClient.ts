import { API_BASE_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export class HttpClient {
  private baseUrl: string;
  private onUnauthorized: (() => Promise<void>) | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setUnauthorizedHandler(handler: () => Promise<void>) {
    this.onUnauthorized = handler;
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    body?: any
  ): Promise<T> {
    const init: RequestInit = {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    };
    let res = await fetch(this.baseUrl + url, init);

    if (res.status === 401 && this.onUnauthorized) {
      await this.onUnauthorized();
      res = await fetch(this.baseUrl + url, init);
    }

    if (!res.ok) {
      const message = await this.safeErrorMessage(res);
      throw new Error(message || `HTTP ${res.status}`);
    }

    if (res.status === 204) return null as T;
    return res.json();
  }

  private async safeErrorMessage(res: Response): Promise<string | null> {
    try {
      const data = await res.json();
      if (typeof data === "string") return data;
      if (data?.detail) return data.detail;
      if (data?.error) return data.error;
      return JSON.stringify(data);
    } catch {
      return null;
    }
  }

  get<T>(url: string) {
    return this.request<T>("GET", url);
  }
  post<T>(url: string, body?: any) {
    return this.request<T>("POST", url, body);
  }
  patch<T>(url: string, body?: any) {
    return this.request<T>("PATCH", url, body);
  }
  delete<T>(url: string) {
    return this.request<T>("DELETE", url);
  }
}

export const http = new HttpClient(API_BASE_URL);
