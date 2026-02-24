import User from "../../assets/icons/user.svg?raw";
import Email from "../../assets/icons/email.svg?raw";
import LockOn from "../../assets/icons/lock-on.svg?raw";

export const profileInfoFields = [
  {
    label: "Username:",
    name: "username",
    type: "text" as const,
    placeholder: "Username",
    icon: User,
    disabled: true,
  },
  {
    label: "Email:",
    name: "email",
    type: "email" as const,
    placeholder: "Email",
    icon: Email,
    disabled: true,
  },
  {
    label: "First Name:",
    name: "first_name",
    type: "text" as const,
    placeholder: "First Name",
    icon: User,
  },
  {
    label: "Last Name:",
    name: "last_name",
    type: "text" as const,
    placeholder: "Last Name",
    icon: User,
  },
  {
    label: "Phone Number:",
    name: "tele_number",
    type: "tel" as const,
    placeholder: "Phone Number",
    icon: User,
  },
];

export const profileBioField = {
  label: "Bio:",
  name: "bio",
  placeholder: "Tell something about yourself...",
  rows: 4,
  resize: "vertical" as const,
};

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
