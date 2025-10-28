export interface Layout {
  render(): HTMLElement;
  setContent(content: HTMLElement): void;
}

export abstract class BasePage {
  protected layout?: Layout;
  private mounted = false;

  constructor(layout?: Layout) {
    this.layout = layout;
  }

  abstract render(): HTMLElement;
  mount?(): void;
  unmount?(): void;

  protected wrapWithLayout(content: HTMLElement): HTMLElement {
    if (this.layout) {
      this.layout.setContent(content);
      return this.layout.render();
    }
    return content;
  }

  public attachTo(root: HTMLElement): void {
    if (this.mounted) {
      this.unmount?.();
    }

    const pageElement = this.render();
    root.innerHTML = '';
    root.appendChild(pageElement);
    this.mount?.();
    this.mounted = true;
  }
}
