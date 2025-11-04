export class AppSidebar {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('aside');
  }

  render(): HTMLElement {
    this.element.innerHTML = /*html*/ `
      <nav class="flex flex-col items-center gap-3">
        <a href="/dashboard" data-link>My Dashboard</a>
        <a href="/boards" data-link>All my Boards</a>
        <a href="/contacts" data-link>My Contacts</a>
      </nav>
      <nav class="flex flex-col items-center gap-3">
        <a href="/privacy" data-link>Privacy Policy</a>
        <a href="/legal" data-link>Legal notice</a>
      </nav>
    `;
    return this.element;
  }
}
