
export class StartPage {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('start-page');
  }

  render(): HTMLElement {
    this.element.innerHTML = /*html*/ `
      <main>
        <h1>StartPage</h1>
        <nav>
          <a class="btn-blue" href="/login" data-link>Login</a>
          <a class="btn-blue" href="/signup" data-link>Signup</a>
        </nav>
      </main>
    `;

    return this.element;
  }
}
