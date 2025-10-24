export class Footer {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('footer');
  }

  render() {
    this.element.innerHTML = `
      <small>© 2025 My App</small>
    `;
    return this.element;
  }
}
