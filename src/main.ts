import { initRouter } from './router';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

import "./style.css";

const root = document.getElementById('app')!;

const router = initRouter(root, [
  { path: '/', component: LoginPage },
  { path: '/signup', component: SignupPage },
]);

document.body.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('[data-link]')) {
    e.preventDefault();
    const href = target.getAttribute('href');
    if (href) router.navigate(href);
  }
});





// import { AuthLayout } from './layouts/AuthLayout';
// import { BoardLayout } from './layouts/BoardLayout';
// import { Login } from './pages/Login';
// import { Signup } from './pages/Signup';
// import { Dashboard } from './pages/Dashboard';
// import { Board } from './pages/Board'

// import "./style.css";

// const routes: Record<string, () => string | HTMLElement> = {
//   '/': Login,
//   '/signup': Signup,
//   '/dashboard': Dashboard,
//   '/board': Board,
// };

// const authRoutes = ['/', '/signup'];
// const boardRoutes = ['/dashboard', '/board'];

// function render(path: string) {
//   const app = document.querySelector('#app');
//   if (!app) return;

//   const route = routes[path];
//   if (!route) {
//     app.innerHTML = `<h1>404 – Seite nicht gefunden</h1>`;
//     return;
//   }

//   const content = route();
//   const htmlContent = typeof content === 'string' ? content : (content as HTMLElement).outerHTML;

//   if (authRoutes.includes(path)) {
//     const mode: "login" | "signup" = path === '/' ? "login" : "signup";
//     app.innerHTML = AuthLayout(htmlContent, mode);
//   } else if (boardRoutes.includes(path)) {
//     app.innerHTML = BoardLayout(htmlContent);
//   } else {
//     app.innerHTML = `<h1>404 – Seite nicht gefunden</h1>`;
//   }
// }

// function navigate(path: string) {
//   window.history.pushState({}, '', path);
//   render(path);
// }

// document.addEventListener('click', (e) => {
//   const target = e.target as HTMLElement;
//   if (target.matches('[data-link]')) {
//     e.preventDefault();
//     const href = (target as HTMLAnchorElement).getAttribute('href');
//     if (href) navigate(href);
//   }
// });

// window.addEventListener('popstate', () => render(window.location.pathname));

// document.addEventListener('DOMContentLoaded', () => render(window.location.pathname));
