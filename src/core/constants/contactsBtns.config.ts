export const tabBtns = [
  {
    id: "findContactsTab",
    class: ["contacts-tab", "contacts-tab-active"],
    type: "button" as const,
    title: "Find Contacts",
    text: "Find Contacts",
  },
  {
    id: "myContactsTab",
    class: ["contacts-tab"],
    type: "button" as const,
    title: "My Contacts",
    text: "My Contacts",
  },
];

export const removeContactBtn = {
  id: "removeContactBtn",
  class: ["btn", "btn-white"],
  type: "button" as const,
  title: "Remove Contact",
  text: "Remove Contact",
};
