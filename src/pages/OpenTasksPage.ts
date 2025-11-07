import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";

export class OpenTasksPage extends BasePage {
  constructor() {
    super(new AppLayout);
  }

  render() {
    const element = document.createElement("section");

    element.innerHTML = `<h1 class="text-(--color-light-blue) underline mb-4">All my open Tasks</h1>`;

    return this.wrapWithLayout(element);
  }
}
