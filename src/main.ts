import { initRouter } from './core/router';
import { authStore } from './core/store/AuthStore';
import { StartPage } from './pages/StartPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { BoardPage } from './pages/BoardPage/BoardPage';

import { PUBLIC_ROUTES } from './core/constants/publicRoutes.config';
import "./css/main.css";

const app = document.getElementById('app')!;

const router = initRouter(app, [
  { path: '/', component: StartPage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/board/:id', component: BoardPage },
]);

async function checkAuthOnStart() {
  const isAuthenticated = await authStore.checkAuthStatus();
  const currentPath = location.pathname;

  if (isAuthenticated && PUBLIC_ROUTES.includes(currentPath)) {
    router.navigate('/dashboard');
  } else if (!isAuthenticated && !PUBLIC_ROUTES.includes(currentPath)) {
    router.navigate('/login');
  }
}

checkAuthOnStart();

document.body.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('[data-link]')) {
    e.preventDefault();
    const href = target.getAttribute('href');
    if (href) router.navigate(href);
  }
});
