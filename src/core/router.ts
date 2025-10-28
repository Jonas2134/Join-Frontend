import type { BasePage } from './BasePage';

type Route = {
  path: string;
  component: new () => BasePage;
};

export let router: Router;

export class Router {
  private routes: Route[];
  private root: HTMLElement;
  private currentPage: BasePage | null = null;

  constructor(root: HTMLElement, routes: Route[]) {
    this.routes = routes;
    this.root = root;
    window.addEventListener("popstate", () => this.render());
  }

  navigate(path: string) {
    history.pushState({}, "", path);
    this.render();
  }

  render() {
    const route = this.routes.find((r) => r.path === location.pathname);
    if (!route) {
      this.root.innerHTML = "<h1>404 Not Found</h1>";
      return;
    }
    this.currentPage?.unmount?.();
    const page = new route.component();
    page.attachTo(this.root);
    this.currentPage = page;
  }
}

export function initRouter(root: HTMLElement, routes: Route[]) {
  router = new Router(root, routes);
  router.render();
  return router;
}
