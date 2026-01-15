export abstract class BaseDropdownMenu {
  protected menu: HTMLElement;
  protected button: HTMLButtonElement;
  protected isOpen: boolean = false;
  protected onClose: (() => void) | null = null;

  constructor(btn: HTMLButtonElement, menuClass?: string) {
    this.button = btn;
    this.menu = document.createElement("menu");

    if (menuClass) this.menu.classList.add(menuClass);

    this.setupBaseBehavior();
  }

  protected setupBaseBehavior() {
    this.button.addEventListener("click", () => this.toggle());
    document.addEventListener("click", (e) => this.handleDocumentClick(e));
  }
  
  protected handleDocumentClick(e: Event) {
    if (
      this.isOpen &&
      !this.button.contains(e.target as Node) &&
      !this.menu?.contains(e.target as Node)
    ) {
      this.close();
    }
  }

  protected abstract renderMenu(): HTMLElement;

  protected calculatePosition() {
    const buttonRect = this.button.getBoundingClientRect();
    const menuRect = this.menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    let left = buttonRect.right - menuRect.width;

    if (left < 8) {
      left = buttonRect.left;
    }

    if (left + menuRect.width > viewportWidth - 8) {
      left = viewportWidth - menuRect.width - 8;
    }

    let top = buttonRect.bottom + 4;

    if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
      top = buttonRect.top - menuRect.height - 4;
    } else if (spaceBelow < menuRect.height) {
      top = Math.max(8, Math.min(top, viewportHeight - menuRect.height - 8));
    }

    this.menu.style.left = `${left}px`;
    this.menu.style.top = `${top}px`;
  }

  setOnCloseCallback(callback: () => void) {
    this.onClose = callback;
  }

  open() {
    if (this.isOpen) return;
    if (this.menu) this.renderMenu();

    this.calculatePosition();
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen || !this.menu) return;
    this.menu.remove();
    this.isOpen = false;
    this.onClose?.();
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  render() {
    return this.menu;
  }
}
