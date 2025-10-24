export class Header {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('header');
  }

  render() {
    this.element.innerHTML = `
      <h1>My App</h1>
      <nav>
        <a href="/" data-link>Login</a>
        <a href="/signup" data-link>Signup</a>
      </nav>
    `;
    return this.element;
  }
}
