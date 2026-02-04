import { BaseDialog } from "../bases/BaseDialog";
import { authStore } from "../../core/store/AuthStore";
import { toastManager } from "../../core/ToastManager";
import { router } from "../../core/router";

import Cross from "../../assets/icons/cross.svg?raw";

export class BurgerMenuDialog extends BaseDialog {
  constructor() {
    super("menu-dialog");
  }

  protected renderContent() {
    const nav = document.createElement("nav");
    nav.classList.add('px-8', 'pt-4');

    const list = document.createElement("ol");
    list.innerHTML = /*html*/ `
      <li>
        <a href="/profile" data-link>Profile</a>
      </li>
      <li>
        <button id="logout-btn">Logout</button>
      </li>
      <li>
        <button id="close-btn">${Cross}</button>
      </li>
    `;

    nav.appendChild(list);
    return nav;
  }

  protected override mount() {
    const logoutBtn = this.dialog.querySelector("#logout-btn") as HTMLElement;
    const closeBtn = this.dialog.querySelector("#close-btn") as HTMLElement;

    logoutBtn.addEventListener("click", async () => {
      try {
        await authStore.logout();
        this.dialog.close();
        router.navigate("/");
      } catch (err: any) {
        toastManager.error("Logout fehlgeschlagen: " + err.message);
      }
    });

    closeBtn.addEventListener("click", () => this.close());
  }
}
