export const editProfileBtn = {
  id: "editProfileBtn",
  class: ["btn", "btn-blue"],
  type: "button" as const,
  title: "Edit Profile",
  text: "Edit Profile",
};

export const profileMenuBtns = [
  {
    class: ["btn", "btn-blue"],
    type: "submit" as const,
    title: "Save",
    text: "Save",
  },
  {
    id: "cancelProfileBtn",
    class: ["btn", "btn-white"],
    type: "button" as const,
    title: "Cancel",
    text: "Cancel",
  },
];

export const showChangePasswordBtn = {
  id: "showChangePasswordBtn",
  class: ["btn", "btn-white"],
  type: "button" as const,
  title: "Change Password",
  text: "Change Password",
};

export const submitChangePasswordBtn = {
  class: ["btn", "btn-blue"],
  type: "submit" as const,
  title: "Change Password",
  text: "Change Password",
};

export const cancelChangePasswordBtn = {
  id: "cancelChangePasswordBtn",
  class: ["btn", "btn-white"],
  type: "button" as const,
  title: "Cancel",
  text: "Cancel",
};
