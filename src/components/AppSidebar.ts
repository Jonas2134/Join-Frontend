export class AppSidebar {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('aside');
  }

  render(): HTMLElement {
    this.element.innerHTML = /*html*/ `
      <nav class="flex flex-col items-center gap-3">
        <a href="/dashboard" data-link>Dashboard</a>
        <a href="/board" data-link>Board</a>
      </nav>
    `;
    return this.element;
  }
}
