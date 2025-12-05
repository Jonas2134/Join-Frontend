import { authStore } from "../store/AuthStore";
import { router } from "../core/router";

import Cross from "../assets/icons/cross.svg?raw";

export class BurgerMenuDialog {
  dialog: HTMLDialogElement;

  constructor() {
    this.dialog = document.createElement("dialog");
    this.dialog.id = "menu-dialog";
    this.dialog.classList.add("menu-dialog");

    this.createMenuDialog();
    this.attachEvents();
  }

  createMenuDialog() {
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
    this.dialog.appendChild(nav);
  }

  attachEvents() {
    const logoutBtn = this.dialog.querySelector("#logout-btn") as HTMLElement;
    const closeBtn = this.dialog.querySelector("#close-btn") as HTMLElement;

    logoutBtn.addEventListener("click", async () => {
      try {
        await authStore.logout();
        this.dialog.close();
        router.navigate("/");
      } catch (err: any) {
        alert("Logout is failed: " + err.message);
      }
    });

    closeBtn.addEventListener("click", () => {
      this.dialog.close();
    });

    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) {
        this.dialog.close();
      }
    });
  }

  open() {
    this.dialog.showModal();
  }

  render() {
    return this.dialog;
  }
}
