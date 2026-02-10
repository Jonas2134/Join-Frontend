export const editBoardDialogBtns = [
  {
    class: ["btn", "btn-blue"],
    type: "submit" as const,
    title: "Edit Board",
    text: "Edit",
  },
  {
    id: "cancel-btn",
    class: ["btn", "btn-white"],
    type: "button" as const,
    title: "Cancel Editing",
    text: "Cancel",
  },
];

export const createTaskDialogBtns = [
  {
    class: ["btn", "btn-blue"],
    type: "submit" as const,
    title: "Save Task",
    text: "Save",
  },
  {
    id: "cancel-btn",
    class: ["btn", "btn-white"],
    type: "button" as const,
    title: "Cancel Creation",
    text: "Cancel",
  },
];

export const editTaskDialogBtns = [
  {
    class: ["btn", "btn-blue"],
    type: "submit" as const,
    title: "Save Task",
    text: "Save",
  },
  {
    id: "cancel-edit-btn",
    class: ["btn", "btn-white"],
    type: "button" as const,
    title: "Cancel Editing",
    text: "Cancel",
  },
  {
    id: "switch-to-view-btn",
    class: ["btn", "btn-white"],
    type: "button" as const,
    title: "Switch to View",
    text: "Switch back",
  },
];
