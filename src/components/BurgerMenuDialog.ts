import Cross from "../assets/icons/cross.svg?raw"

export class BurgerMenuDialog {
  dialog: HTMLDialogElement;

  constructor() {
    this.dialog = document.createElement("dialog");
    this.dialog.id = "menu-dialog";
    this.dialog.classList.add('menu-dialog');

    this.createMenuDialog();
  }

  createMenuDialog() {
    const nav = document.createElement("nav");
    const list = document.createElement("ol");
    list.innerHTML = /*html*/ `
      <li>
        <a href="">Profile</a>
      </li>
      <li>
        <span>Logout</span>
      </li>
      <li>
        <button>${Cross}</button>
      </li>
    `;
    nav.appendChild(list);
    this.dialog.appendChild(nav);
  }

  attachEvents() {}

  open() {
    this.dialog.showModal();
  }

  render() {
    return this.dialog;
  }
}