import type { BasePage } from '../components/bases/BasePage';

type RouteConfig = {
  path: string;
  component: new (params: Record<string, string>) => BasePage;
};

type Route = RouteConfig & {
  regex: RegExp;
  paramNames: string[];
};

export let router: Router;

type RouteGuard = (path: string) => string | null;

export class Router {
  private routes: Route[];
  private root: HTMLElement;
  private currentPage: BasePage | null = null;
  private guard: RouteGuard | null = null;

  constructor(root: HTMLElement, routes: Route[]) {
    this.routes = routes;
    this.root = root;
    window.addEventListener("popstate", () => this.render());
  }

  setGuard(guard: RouteGuard) {
    this.guard = guard;
  }

  navigate(path: string) {
    history.pushState({}, "", path);
    this.render();
  }

  render() {
    if (this.guard) {
      const redirect = this.guard(location.pathname);
      if (redirect) {
        this.navigate(redirect);
        return;
      }
    }
    let matchedRoute: Route | null = null;
    let params: Record<string, string> = {};

    for (const r of this.routes) {
      const match = location.pathname.match(r.regex);
      if (match) {
        matchedRoute = r;
        params = {};
        r.paramNames.forEach((name, index) => {
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

export function initRouter(root: HTMLElement, routes: RouteConfig[]) {
  const processedRoutes: Route[] = routes.map((route) => {
    const paramNames: string[] = [];

    const regexPath = route.path.replace(/:([^/]+)/g, (_, key) => {
      paramNames.push(key);
      return "([^/]+)";
    });

    return {
      ...route,
      regex: new RegExp(`^${regexPath}$`),
      paramNames,
    };
  });

  router = new Router(root, processedRoutes);
  router.render();
  return router;
}
