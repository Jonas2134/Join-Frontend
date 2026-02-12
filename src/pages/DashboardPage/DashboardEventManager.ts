import { BoardCreateDialog } from "./BoardCreateDialog";
import { router } from "../../core/router";

export class DashboardEventManager {
  dialog: BoardCreateDialog | null = null;

  constructor() {}

  registerBoardCreateListerner(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#createBoardBtn");
    if (!btn) return;
    this.openBoardCreateDialog();
  }

  registerNavigateToArchivedBoardsListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#archivedBoardsBtn");
    if (!btn) return;
    this.redirectTo("/archived-boards");
  }

  registerNavigateToBoardListener(e: Event) {
    if (this.findClosestElement(e.target, ".three-dot-btn")) return;

    const listItem = this.findClosestElement<HTMLElement>(e.target, ".board-row");
    if (!listItem) return;

    const boardId = listItem.dataset.boardId;
    if (boardId) this.redirectTo(`/board/${boardId}`);
  }

  registerDashboardThreeDotDropdown(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, ".three-dot-btn");
    if (!btn) return;

    const listItem = this.findClosestElement<HTMLElement>(btn, ".board-row");
    const boardId = listItem?.dataset.boardId;
    console.log("Board Id is: " + boardId);
  }

  redirectTo(path: string) {
    router.navigate(path);
  }
  
  openBoardCreateDialog() {
    this.dialog = new BoardCreateDialog();
    document.body.appendChild(this.dialog.render());
    this.dialog?.open();
  }

  private findClosestElement<T extends HTMLElement>(
    target: EventTarget | null,
    selector: string,
  ): T | null {
    if (target instanceof HTMLElement) {
      return target.closest<T>(selector);
    }
    if (target instanceof SVGElement) {
      return (target.closest(selector) as T) || null;
    }
    return null;
  }
}
