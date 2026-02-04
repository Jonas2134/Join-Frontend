export class AuthFooter {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement("footer");
    this.element.classList.add("auth-footer");
  }

  render() {
    this.element.innerHTML = `
      <small>© 2025 My App</small>
    `;
    return this.element;
  }
}
