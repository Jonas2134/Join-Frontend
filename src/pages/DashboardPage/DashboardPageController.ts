import { BasePageController } from "../../components/bases/BasePageController";
import { BoardCreateDialog } from "./BoardCreateDialog";
import { DashboardBoardDropdown } from "./DashboardBoardDropdown";

export class DashboardPageController extends BasePageController {
  dialog: BoardCreateDialog | null = null;
  private activeDropdown: DashboardBoardDropdown | null = null;

  constructor() {
    super();
  }

  // ============================================
  // Public Event Listeners
  // ============================================

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

    const listItem = this.findClosestElement<HTMLLIElement>(btn, ".board-row");
    if (!listItem) return;

    const boardId = listItem.dataset.boardId;
    const isOwner = listItem.dataset.isOwner === "true";
    const boardTitle = listItem.dataset.boardTitle ?? "";
    if (!boardId) return;

    this.activeDropdown?.close();
    this.activeDropdown = new DashboardBoardDropdown(btn, boardId, isOwner, boardTitle);
    document.body.appendChild(this.activeDropdown.render());
    this.activeDropdown.toggle();
    this.activeDropdown.setOnCloseCallback(() => {
      this.activeDropdown = null;
    });
  }

  // ============================================
  // Dialog & Dropdown Management
  // ============================================

  openBoardCreateDialog() {
    this.dialog = new BoardCreateDialog();
    this.openDialog(this.dialog);
  }
}
