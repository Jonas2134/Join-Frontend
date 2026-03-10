import { BasePage } from '../../components/bases/BasePage';
import { StaticLayout } from '../../layouts/StaticLayout';

export abstract class BaseStaticPage extends BasePage {
  protected element: HTMLElement;

  protected abstract headline: string;
  protected abstract content: string;

  constructor() {
    super(new StaticLayout());
    this.element = document.createElement('article');
    this.element.classList.add('static-content');
  }

  private renderHeadline(): HTMLElement {
    const title = document.createElement('h1');
    title.textContent = this.headline;
    return title;
  }

  private renderContent(): HTMLElement {
    const content = document.createElement('div');
    content.innerHTML = this.content;
    return content;
  }

  render(): HTMLElement {
    this.element.append(this.renderHeadline(), this.renderContent());
    return this.wrapWithLayout(this.element);
  }
}
