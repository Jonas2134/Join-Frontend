import Editicon from "../../assets/icons/edit.svg?raw";

export const threeDotFormBtns = [
  {
    menu: "rename" as const,
    config: [
      {
        class: "three-dot-btn",
        type: "submit" as const,
        title: "Rename Column",
        icon: Editicon,
      },
      {
        id: "cancel-rename-btn",
        class: "three-dot-btn",
        type: "button" as const,
        title: "Cancel Renameing",
        text: "X",
      },
    ],
  },
  {
    menu: "limit" as const,
    config: [
      {
        class: "three-dot-btn",
        type: "submit" as const,
        title: "Set Task Limit",
        icon: Editicon,
      },
      {
        id: "cancel-limit-btn",
        class: "three-dot-btn",
        type: "button" as const,
        title: "Cancel Setting Limit",
        text: "X",
      },
    ],
  },
];

export const threeDotRenameBtn = {
  id: "rename-column-btn",
  class: "dropdown-btn",
  type: "button" as const,
  title: "Rename Column",
  text: "Rename Column",
};

export const threeDotLimitBtn = {
  id: "set-task-limit-btn",
  class: "dropdown-btn",
  type: "button" as const,
  title: "Set Task Limit",
  text: "Set Task Limit",
};

export const threeDotDelBtn = {
  id: "delete-column-btn",
  class: "dropdown-btn",
  type: "button" as const,
  title: "Delete Column",
  text: "Delete Column",
};
