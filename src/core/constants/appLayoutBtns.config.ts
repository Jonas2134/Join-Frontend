import Burgermenu from "../../assets/icons/menu.svg?raw"

export const burgerMenuBtn = {
  id: "burger-menu-btn",
  class: "menu",
  type: "button" as const,
  title: "Burgermenu",
  icon: Burgermenu
}

export const burgerMenuListBtns = [
  {
    id: "burger-profile-btn",
    class: "dropdown-btn",
    type: "button" as const,
    title: "To Profile",
    text: "Profile",
  },
  {
    id: "burger-logout-btn",
    class: ["dropdown-btn", "dropdown-btn--danger"],
    type: "button" as const,
    title: "Logout",
    text: "Logout",
  },
];
