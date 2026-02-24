import { BasePageController } from "../../components/bases/BasePageController";

export class ProfilePageController extends BasePageController {

  registerEditToggleListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#editProfileBtn");
    if (!btn) return;

    this.toggleEditMode(true);
  }

  registerCancelEditListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#cancelProfileBtn");
    if (!btn) return;

    this.toggleEditMode(false);
  }

  registerSaveProfileListener(e: Event) {
    const form = this.findClosestElement<HTMLFormElement>(e.target, "#profileForm");
    if (!form) return;

    e.preventDefault();
    // TODO: API-Call zum Speichern
  }

  registerShowPasswordSectionListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#showChangePasswordBtn");
    if (!btn) return;

    this.togglePasswordSection(true);
  }

  registerCancelPasswordSectionListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#cancelChangePasswordBtn");
    if (!btn) return;

    this.togglePasswordSection(false);
  }

  registerChangePasswordListener(e: Event) {
    const form = this.findClosestElement<HTMLFormElement>(e.target, "#changePasswordForm");
    if (!form) return;

    e.preventDefault();
    // TODO: API-Call zum Passwort ändern
  }

  private togglePasswordSection(showPassword: boolean) {
    const profileSection = document.getElementById("profileInfoSection");
    const passwordSection = document.getElementById("passwordSection");

    if (profileSection) profileSection.classList.toggle("hidden", showPassword);
    if (passwordSection) passwordSection.classList.toggle("hidden", !showPassword);
  }

  private toggleEditMode(isEditing: boolean) {
    const form = document.getElementById("profileForm") as HTMLFormElement | null;
    if (!form) return;

    const editableFields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[name="first_name"], input[name="last_name"], input[name="tele_number"], textarea[name="bio"]'
    );

    editableFields.forEach(field => {
      field.disabled = !isEditing;
    });

    const emailFieldWrapper = document.getElementById("emailFieldWrapper");
    if (emailFieldWrapper) emailFieldWrapper.classList.toggle("hidden", !isEditing);

    const editBtn = document.getElementById("editProfileBtn");
    const saveBtn = document.getElementById("saveProfileBtn");
    const cancelBtn = document.getElementById("cancelProfileBtn");

    if (editBtn) editBtn.classList.toggle("hidden", isEditing);
    if (saveBtn) saveBtn.classList.toggle("hidden", !isEditing);
    if (cancelBtn) cancelBtn.classList.toggle("hidden", !isEditing);
  }
}
