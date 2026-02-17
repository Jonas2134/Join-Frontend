import { BasePageController } from "../../components/bases/BasePageController";
import { BoardCreateDialog } from "./BoardCreateDialog";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { DashboardBoardDropdown } from "./DashboardBoardDropdown";
import { appStore } from "../../core/store/AppStore";

const BOARD_ITEM_SELECTOR = ".board-row, .board-card";

export class DashboardPageController extends BasePageController {
  private activeDropdown: DashboardBoardDropdown | null = null;

  // ============================================
  // Public Event Listeners
  // ============================================

  registerBoardCreateListerner(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#createBoardBtn");
    if (!btn) return;
    this.openDialog(new BoardCreateDialog());
  }

  registerNavigateToArchivedBoardsListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#archivedBoardsBtn");
    if (!btn) return;
    this.redirectTo("/archived-boards");
  }

  registerNavigateToBoardListener(e: Event) {
    if (this.findClosestElement(e.target, ".three-dot-btn")) return;
    if (this.findClosestElement(e.target, ".dashboard-dropdown-menu")) return;

    const listItem = this.findClosestElement<HTMLElement>(e.target, BOARD_ITEM_SELECTOR);
    if (!listItem) return;

    const boardId = listItem.dataset.boardId;
    if (boardId) this.redirectTo(`/board/${boardId}`);
  }

  registerDashboardThreeDotDropdown(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, ".three-dot-btn");
    if (!btn) return;

    const listItem = this.findClosestElement<HTMLElement>(btn, BOARD_ITEM_SELECTOR);
    if (!listItem) return;

    const isOwner = listItem.dataset.isOwner === "true";
    if (!listItem.dataset.boardId) return;

    this.toggleDropdown(
      this.activeDropdown,
      () => new DashboardBoardDropdown(btn, isOwner),
      listItem,
      (d) => { this.activeDropdown = d; },
    );
  }

  registerArchiveBoardListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#archive-board-btn");
    if (!btn) return;

    const boardId = this.getDatasetFromClosest(btn, BOARD_ITEM_SELECTOR, "boardId");
    if (!boardId) return;

    this.activeDropdown?.close();
    const dialog = new ConfirmDialog({
      title: "Archived Board",
      message: "Are you sure you want to archive the board?",
      confirmText: "Confirmed",
      onConfirm: async () => {
        await this.performStoreOperation(
          () => appStore.archiveBoard(boardId, false),
          "Archive",
        );
      },
    });
    this.openDialog(dialog);
  }

  registerDeleteBoardListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#delete-board-btn");
    if (!btn) return;

    const listItem = this.findClosestElement<HTMLElement>(btn, BOARD_ITEM_SELECTOR);
    const boardId = listItem?.dataset.boardId;
    const boardTitle = listItem?.dataset.boardTitle ?? "";
    if (!boardId) return;

    this.activeDropdown?.close();
    const dialog = new ConfirmDialog({
      title: "Delete Board",
      message: `Are you sure you want to delete "${boardTitle}"? All columns and tasks will be permanently deleted.`,
      confirmText: "Delete",
      onConfirm: async () => {
        await this.performStoreOperation(
          () => appStore.deleteBoard(boardId),
          "Deletion",
        );
      },
    });
    this.openDialog(dialog);
  }

  registerViewToggleListener(e: Event, onSwitch: (view: "list" | "card") => void) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.name !== "dashboard-view") return;

    const view = target.value as "list" | "card";
    onSwitch(view);
  }
}
