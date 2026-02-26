import { Button } from "../../../components/common/Button";
import { findContactsTabBtn, myContactsTabBtn } from "../../../core/constants/contactsBtns.config";

export class ContactTabsRenderer {

  // TODO: add Header
  renderTabs(): HTMLElement {
    const nav = document.createElement("nav");
    nav.classList.add("contacts-tabs");

    const findTab = new Button(findContactsTabBtn).renderBtn();
    const myTab = new Button(myContactsTabBtn).renderBtn();

    nav.append(findTab, myTab);
    return nav;
  }
}
