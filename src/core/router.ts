import type { BasePage } from './BasePage';

type Route = {
  path: string;
  component: new (params?: any) => BasePage;
  regex?: RegExp;
  paramNames?: string[];
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
    let matchedRoute: Route | null = null;
    let params: Record<string, string> = {};

    for (const r of this.routes) {
      const match = location.pathname.match(r.regex!);
      if (match) {
        matchedRoute = r;
        params = {};
        r.paramNames!.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        break;
      }
    }

    if (!matchedRoute) {
      this.root.innerHTML = "<h1>404 Not Found</h1>";
      return;
    }

    this.currentPage?.unmount?.();

    const page = new matchedRoute.component(params);

    page.attachTo(this.root);
    this.currentPage = page;
  }
}

export function initRouter(root: HTMLElement, routes: Route[]) {
  for (const route of routes) {
    const paramNames: string[] = [];

    const regexPath = route.path.replace(/:([^/]+)/g, (_, key) => {
      paramNames.push(key);
      return "([^/]+)";
    });
    route.regex = new RegExp(`^${regexPath}$`);
    route.paramNames = paramNames;
  }
  router = new Router(root, routes);
  router.render();
  return router;
}
