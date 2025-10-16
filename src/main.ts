import { AuthLayout } from './layouts/AuthLayout';
import { BoardLayout } from './layouts/BoardLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Board } from './pages/Board'

import "./style.css";

const routes: Record<string, () => string> = {
  '/': Login,
  '/signup': Signup,
  '/dashboard': Dashboard,
  '/board': Board,
};

const authRoutes = ['/', '/signup'];
const boardRoutes = ['/dashboard', '/board'];

function render(path: string) {
  const app = document.querySelector('#app');
  if (!app) return;

  if (authRoutes.includes(path)) {
    app.innerHTML = AuthLayout(routes[path]());
  } else if (boardRoutes.includes(path)) {
    app.innerHTML = BoardLayout(routes[path]());
  } else {
    app.innerHTML = `<h1>404 – Seite nicht gefunden</h1>`;
  }
}

function navigate(path: string) {
  window.history.pushState({}, '', path);
  render(path);
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('[data-link]')) {
    e.preventDefault();
    const href = (target as HTMLAnchorElement).getAttribute('href');
    if (href) navigate(href);
  }
});

window.addEventListener('popstate', () => render(window.location.pathname));

document.addEventListener('DOMContentLoaded', () => render(window.location.pathname));
