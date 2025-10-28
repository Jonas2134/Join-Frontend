export class AuthFooter {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('footer');
    this.element.classList.add('fixed', 'bottom-0', 'right-0', 'left-0', 'px-10', 'py-5', 'flex', 'justify-center');
  }

  render() {
    this.element.innerHTML = `
      <small>© 2025 My App</small>
    `;
    return this.element;
  }
}
