import User from "../../assets/icons/user.svg?raw";
import Email from "../../assets/icons/email.svg?raw";
import Tele from "../../assets/icons/tele.svg?raw";
import LockOn from "../../assets/icons/lock-on.svg?raw";

export const profileEmailField = {
  label: "Email:",
  name: "email",
  type: "email" as const,
  placeholder: "Email",
  icon: Email,
  className: "input-b-border",
};

export const profileInfoFields = [
  {
    type: "input" as const,
    value: "first_name" as const,
    config: {
      label: "First Name:",
      name: "first_name",
      type: "text" as const,
      placeholder: "First Name",
      icon: User,
      className: "input-b-border",
    },
  },
  {
    type: "input" as const,
    value: "last_name" as const,
    config: {
      label: "Last Name:",
      name: "last_name",
      type: "text" as const,
      placeholder: "Last Name",
      icon: User,
      className: "input-b-border",
    },
  },
  {
    type: "input" as const,
    value: "tele_number" as const,
    config: {
      label: "Phone Number:",
      name: "tele_number",
      type: "tel" as const,
      placeholder: "Phone Number",
      icon: Tele,
      className: "input-b-border",
    },
  },
  {
    type: "textarea" as const,
    value: "bio" as const,
    config: {
      label: "Bio:",
      name: "bio",
      placeholder: "Tell something about yourself...",
      rows: 4,
      resize: "vertical" as const,
      className: "input-b-border",
    },
  },
];

export const passwordFields = [
  {
    label: "Current Password:",
    name: "old_password",
    type: "password" as const,
    placeholder: "Current Password",
    icon: LockOn,
    autocomplete: "current-password" as const,
  },
  {
    label: "New Password:",
    name: "new_password",
    type: "password" as const,
    placeholder: "New Password",
    icon: LockOn,
    autocomplete: "new-password" as const,
  },
  {
    label: "Repeat New Password:",
    name: "repeated_new_password",
    type: "password" as const,
    placeholder: "Repeat New Password",
    icon: LockOn,
    autocomplete: "new-password" as const,
  },
];
