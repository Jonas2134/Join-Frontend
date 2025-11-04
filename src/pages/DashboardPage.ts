import { AppLayout } from "../layouts/AppLayout";
import { BasePage } from "../core/BasePage";
import { SummaryButton } from "../components/SummaryButton";
// import { router } from '../core/router';

export class DashboardPage extends BasePage {
  constructor() {
    super(new AppLayout());
  }

  render() {
    const element = document.createElement("section");

    const grid = document.createElement("section");
    grid.className = "grid grid-cols-4 grid-rows-2 gap-2";

    const buttonsData = [
      { label: "Urgent Tasks", image: "/assets/icons/urgent.svg", route: "/summary", query: { filter: "urgent" }, classes: "col-span-3" },
      { label: "All open Boards", image: "/assets/icons/boards.svg", route: "/summary", query: { filter: "open" } },
      { label: "Task To-Do", image: "/assets/icons/todo.svg", route: "/summary", query: { filter: "todo" } },
      { label: "Tasks in Progress", image: "/assets/icons/inprogress.svg", route: "/summary", query: { filter: "progress" } },
      { label: "Awaiting Feedback", image: "/assets/icons/feedback.svg", route: "/summary", query: { filter: "feedback" } },
      { label: "All Boards", image: "/assets/icons/all.svg", route: "/summary" },
    ];

    buttonsData.forEach((btn) => {
      const summaryButton = new SummaryButton(btn);
      grid.appendChild(summaryButton.render());
    });

    element.innerHTML = `<h1 class="text-(--color-light-blue) underline mb-4">My Dashboard</h1>`;
    element.appendChild(grid);

    return this.wrapWithLayout(element);
  }
}
