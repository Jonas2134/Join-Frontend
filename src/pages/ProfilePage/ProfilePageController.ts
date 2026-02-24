import { BasePageController } from "../../components/bases/BasePageController";
import { profileStore } from "../../core/store/ProfileStore";
import { authStore } from "../../core/store/AuthStore";

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
    this.populateFormFields();
  }

  async registerSaveProfileListener(e: Event) {
    const form = this.findClosestElement<HTMLFormElement>(e.target, "#profileForm");
    if (!form) return;

    e.preventDefault();

    const formData = new FormData(form);

    await this.performStoreOperation(
      () => profileStore.updateProfile({
        email: formData.get("email") as string,
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
        tele_number: formData.get("tele_number") as string,
        bio: formData.get("bio") as string,
      }),
      "Profile update",
    );

    this.toggleEditMode(false);
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

  async registerChangePasswordListener(e: Event) {
    const form = this.findClosestElement<HTMLFormElement>(e.target, "#changePasswordForm");
    if (!form) return;

    e.preventDefault();

    const formData = new FormData(form);

    await this.performStoreOperation(
      () => authStore.changePassword(
        formData.get("old_password") as string,
        formData.get("new_password") as string,
        formData.get("repeated_new_password") as string,
      ),
      "Password change",
    );

    form.reset();
    this.togglePasswordSection(false);
  }

  populateFormFields() {
    const profile = profileStore.profile;
    if (!profile) return;

    const form = document.getElementById("profileForm") as HTMLFormElement | null;
    if (!form) return;

    const fields: Record<string, string> = {
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      tele_number: profile.tele_number,
      bio: profile.bio,
    };

    for (const [name, value] of Object.entries(fields)) {
      const field = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
      if (field) field.value = value ?? "";
    }
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
