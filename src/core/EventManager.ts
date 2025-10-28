export class EventManager {
  private listeners: Array<() => void> = [];

  on<T extends keyof HTMLElementEventMap>(
    el: HTMLElement | Document | Window,
    event: T,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any
  ) {
    el.addEventListener(event, handler as EventListener);
    this.listeners.push(() => el.removeEventListener(event, handler as EventListener));
  }

  clearAll() {
    this.listeners.forEach(remove => remove());
    this.listeners = [];
  }
}
