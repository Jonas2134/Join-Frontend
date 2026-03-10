import { BasePageController } from "../components/bases/BasePageController";
import { BurgerMenuDropdown } from "./BurgerMenuDropdown";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { authStore } from "../core/store/AuthStore";
import { boardStore } from "../core/store/BoardStore";
import { contactStore } from "../core/store/ContactStore";
import { profileStore } from "../core/store/ProfileStore";
import { toastManager } from "../core/ToastManager";

export class AppLayoutController extends BasePageController {
  private menuDropdown: BurgerMenuDropdown | null = null;

  registerHeaderClickListener(e: Event, container: HTMLElement) {
    const menuBtn = this.findClosestElement<HTMLButtonElement>(
      e.target,
      "#burger-menu-btn",
    );
    if (menuBtn) {
      e.preventDefault();
      this.toggleDropdown(
        this.menuDropdown,
        () => new BurgerMenuDropdown(menuBtn),
        container,
        (d) => { this.menuDropdown = d; },
      );
      return;
    }

    if (this.findClosestElement(e.target, "#burger-profile-btn")) {
      this.menuDropdown?.close();
      this.redirectTo("/profile");
    }

    if (this.findClosestElement(e.target, "#burger-logout-btn")) {
      this.menuDropdown?.close();
      this.openLogoutDialog();
    }
  }

  private openLogoutDialog() {
    const dialog = new ConfirmDialog({
      title: "Logout",
      message: "Are you sure you want to logout?",
      confirmText: "Logout",
      onConfirm: async () => {
        try {
          await authStore.logout();
          boardStore.reset();
          contactStore.reset();
          profileStore.reset();
          this.redirectTo("/");
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          toastManager.error("Logout fehlgeschlagen: " + message);
        }
      },
    });
    this.openDialog(dialog);
  }

  cleanup() {
    this.menuDropdown?.close();
    this.menuDropdown = null;
  }
}
