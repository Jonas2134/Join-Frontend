import { Button } from "../../../components/common/Button";
import { tabBtns } from "../../../core/constants/contactsBtns.config";

export class ContactTabsRenderer {

  renderHeader(): HTMLElement {
    const header = document.createElement("header");

    const headline = document.createElement("h2");
    headline.classList.add("text-(--color-light-blue)", "underline");
    headline.textContent = "Contacts";

    const nav = this.renderTabs();

    header.append(headline, nav);
    return header;
  }

  renderTabs(): HTMLElement {
    const nav = document.createElement("nav");
    nav.classList.add("contacts-tabs");

    const btns = tabBtns.map((config) =>
      new Button({ ...config }).renderBtn()
    );

    nav.append(...btns);
    return nav;
  }
}
