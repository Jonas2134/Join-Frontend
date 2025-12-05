import { initRouter } from './core/router';
import { StartPage } from './pages/StartPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { BoardPage } from './pages/BoardPage';
import { OpenTasksPage } from './pages/OpenTasksPage';

import "./css/main.css";

const app = document.getElementById('app')!;

const router = initRouter(app, [
  { path: '/', component: StartPage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/board/:id', component: BoardPage },
  { path: '/open-tasks', component: OpenTasksPage },
]);

document.body.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('[data-link]')) {
    e.preventDefault();
    const href = target.getAttribute('href');
    if (href) router.navigate(href);
  }
});
