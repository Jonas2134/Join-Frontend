type Component = {
  render(): HTMLElement;
  mount?(): void;
  unmount?(): void;
};
type Route = {
  path: string;
  component: new () => Component;
};

export let router: Router;

export class Router {
  private routes: Route[];
  private root: HTMLElement;
  private currentPage: Component | null = null;

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
    this.root.innerHTML = "";
    this.root.appendChild(page.render());
    page.mount?.();

    this.currentPage = page;
  }
}

export function initRouter(root: HTMLElement, routes: Route[]) {
  router = new Router(root, routes);
  router.render();
  return router;
}
