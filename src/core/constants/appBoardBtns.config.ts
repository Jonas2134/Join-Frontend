import EditIcon from "../../assets/icons/edit.svg?raw"

export const boardAddTaskBtn = {
  class: ["create-task-btn", "btn"],
  type: "button" as const,
  title: "Add Task",
  text: "+ add Task",
};

export const boardAddColumnBtn = {
  class: ["create-column-btn", "btn"],
  type: "button" as const,
  title: "Add Column",
  text: "+ New Column",
};

export const boardAddColumnFormBtns = [
  {
    class: ["btn-blue", "btn"],
    type: "submit" as const,
    title: "Submit new column",
    text: "+ Add",
  },
  {
    class: ["cancel-column-btn", "btn"],
    type: "button" as const,
    title: "Cancel adding column",
    text: "Cancel",
  },
];

export const editBoardBtn = {
  id: "editBoardBtn",
  class: "edit-btn",
  title: "Edit board",
  icon: EditIcon,
};

export const moreIndicator = {
  id: "more-indicator",
  class: ["round-base-btn", "more-indicator-btn"],
  type: "button" as const,
};
