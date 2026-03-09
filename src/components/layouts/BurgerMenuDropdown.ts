import { BaseDropdownMenu } from "../bases/BaseDropdownMenu";
import { Button } from "../common/Button";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { burgerMenuListBtns } from "../../core/constants/appLayoutBtns.config";
import { authStore } from "../../core/store/AuthStore";
import { boardStore } from "../../core/store/BoardStore";
import { contactStore } from "../../core/store/ContactStore";
import { profileStore } from "../../core/store/ProfileStore";
import { toastManager } from "../../core/ToastManager";
import { router } from "../../core/router";

import type { ButtonOptions } from "../common/Button";

export class BurgerMenuDropdown extends BaseDropdownMenu {
  constructor(btn: HTMLButtonElement) {
    super(btn, "burger-dropdown-menu");
  }

  protected renderMenu(): HTMLElement {
    const menu = this.menu;
    menu.innerHTML = "";

    const listItems = burgerMenuListBtns.map((config) =>
      this.renderMenuListItem(config)
    );

    menu.append(...listItems);
    this.mount();
    return menu;
  }

  private renderMenuListItem(btnConfig: ButtonOptions): HTMLLIElement {
    const item = document.createElement("li");
    item.classList.add("menu-item");
    item.appendChild(new Button(btnConfig).renderBtn());
    return item;
  }

  private mount() {
    const profileBtn = this.menu.querySelector<HTMLButtonElement>("#burger-profile-btn");
    const logoutBtn = this.menu.querySelector<HTMLButtonElement>("#burger-logout-btn");

    profileBtn?.addEventListener("click", () => {
      this.close();
      router.navigate("/profile");
    });

    logoutBtn?.addEventListener("click", () => {
      this.close();
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
            router.navigate("/");
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            toastManager.error("Logout fehlgeschlagen: " + message);
          }
        },
      });
      document.body.appendChild(dialog.render());
      dialog.open();
    });
  }
}
