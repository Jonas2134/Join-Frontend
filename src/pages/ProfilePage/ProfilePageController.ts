import { BasePageController } from "../../components/bases/BasePageController";
import { profileStore } from "../../core/store/ProfileStore";
import { authStore } from "../../core/store/AuthStore";
import { ProfileInfoRenderer } from "./renderers/ProfileInfoRenderer";
import { ProfilePasswordRenderer } from "./renderers/ProfilePasswordRenderer";

export class ProfilePageController extends BasePageController {
  private infoRenderer = new ProfileInfoRenderer();
  private passwordRenderer = new ProfilePasswordRenderer();

  // ============================================
  // Event Listeners
  // ============================================

  registerEditToggleListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#editProfileBtn");
    if (!btn) return;

    this.enableEditMode();
  }

  registerCancelEditListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#cancelProfileBtn");
    if (!btn) return;

    this.rerenderProfileSection();
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

    window.dispatchEvent(new Event("profile:updated"));
  }

  registerShowPasswordSectionListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#showChangePasswordBtn");
    if (!btn) return;

    this.showPasswordSection();
  }

  registerCancelPasswordSectionListener(e: Event) {
    const btn = this.findClosestElement<HTMLButtonElement>(e.target, "#cancelChangePasswordBtn");
    if (!btn) return;

    this.rerenderProfileSection();
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

    this.rerenderProfileSection();
  }

  // ============================================
  // DOM Manipulation
  // ============================================

  private enableEditMode() {
    const form = document.getElementById("profileForm") as HTMLFormElement | null;
    if (!form) return;

    const editableFields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[name="first_name"], input[name="last_name"], input[name="tele_number"], textarea[name="bio"]'
    );
    editableFields.forEach(field => field.disabled = false);

    const fieldsWrapper = form.querySelector(".fields-wrapper");
    if (fieldsWrapper) {
      const emailField = this.infoRenderer.renderEmailField(profileStore.profile?.email);
      fieldsWrapper.prepend(emailField);
    }

    const menu = form.querySelector(".profile-actions");
    if (menu) {
      menu.innerHTML = "";
      const btns = this.infoRenderer.renderSubmitBtnMenu();
      menu.append(...btns);
    }
  }

  private showPasswordSection() {
    const section = document.getElementById("profileSection");
    if (!section) return;

    section.innerHTML = "";
    this.passwordRenderer.renderPasswordSection(section);
  }

  rerenderProfileSection() {
    const section = document.getElementById("profileSection");
    const profile = profileStore.profile;
    if (!section || !profile) return;

    section.innerHTML = "";
    this.infoRenderer.renderProfileForm(section, profile);
  }
}
