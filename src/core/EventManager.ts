export class EventManager {
  private listeners: Array<() => void> = [];

  on(
    el: HTMLElement | Document | Window,
    event: string,
    handler: EventListenerOrEventListenerObject
  ) {
    el.addEventListener(event, handler as EventListener);
    this.listeners.push(() => el.removeEventListener(event, handler as EventListener));
  }

  clearAll() {
    this.listeners.forEach(remove => remove());
    this.listeners = [];
  }
}
