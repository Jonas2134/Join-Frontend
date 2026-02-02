import Editicon from "../../assets/icons/edit.svg?raw";
import VerticalDotsIcon from "../../assets/icons/menu-vertical.svg?raw"

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

export const threeDotBtn = {
  class: "column-menu-btn",
  type: "button" as const,
  title: "Column menu",
  icon: VerticalDotsIcon,
};

// Task Dropdown Buttons
export const taskThreeDotBtn = {
  class: "task-menu-btn",
  type: "button" as const,
  title: "Task menu",
  icon: VerticalDotsIcon,
};

export const taskViewDetailsBtn = {
  id: "view-task-btn",
  class: "dropdown-btn",
  type: "button" as const,
  title: "View Details",
  text: "View Details",
};

export const taskDetailCloseBtn = {
  id: "close-detail-btn",
  class: "task-detail-close-btn",
  type: "button" as const,
  title: "Close",
  text: "x",
};

export const taskEditBtn = {
  id: "edit-task-btn",
  class: "dropdown-btn",
  type: "button" as const,
  title: "Edit Task",
  text: "Edit Task",
};

export const taskDeleteBtn = {
  id: "delete-task-btn",
  class: "dropdown-btn",
  type: "button" as const,
  title: "Delete Task",
  text: "Delete Task",
};
