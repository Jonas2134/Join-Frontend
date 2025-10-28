import { HttpClient } from '../core/HttpClient';
import { Store } from '../core/Store';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export class AuthService {
  private http = new HttpClient();
  public state = new Store<AuthState>({
    user: null,
    loading: false,
    error: null,
  });

  constructor() {
    this.checkSession();
  }

  async login(email: string, password: string): Promise<void> {
    this.state.set({ ...this.state.get(), loading: true, error: null });
    try {
      await this.http.post('/auth/login', { email, password });
      await this.checkSession();
    } catch (err: any) {
      this.state.set({
        ...this.state.get(),
        error: err.message ?? 'Login failed',
      });
    } finally {
      this.state.set({ ...this.state.get(), loading: false });
    }
  }

  async signup(email: string, password: string, name: string): Promise<void> {
    this.state.set({ ...this.state.get(), loading: true, error: null });
    try {
      await this.http.post('/auth/signup', { email, password, name });
      await this.checkSession();
    } catch (err: any) {
      this.state.set({
        ...this.state.get(),
        error: err.message ?? 'Signup failed',
      });
    } finally {
      this.state.set({ ...this.state.get(), loading: false });
    }
  }

  async logout(): Promise<void> {
    try {
      await this.http.post('/auth/logout', {});
    } finally {
      this.state.set({ user: null, loading: false, error: null });
    }
  }

  async checkSession(): Promise<void> {
    try {
      const user = await this.http.get<User>('/auth/me');
      this.state.set({ user, loading: false, error: null });
    } catch {
      this.state.set({ user: null, loading: false, error: null });
    }
  }

  isAuthenticated(): boolean {
    return !!this.state.get().user;
  }
}

export const authService = new AuthService();
