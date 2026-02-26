import { http } from "../api/HttpClient";
import { API_ROUTES } from "../api/config";
import type { Contact, UserDetail } from "../types/contact.types";

class ContactStore {
  contacts: Contact[] = [];

  async loadContacts(): Promise<Contact[]> {
    this.contacts = await http.get<Contact[]>(API_ROUTES.contacts.list);
    return this.contacts;
  }

  async searchUsers(query: string): Promise<Contact[]> {
    return await http.get<Contact[]>(`${API_ROUTES.users.list}?search=${encodeURIComponent(query)}`);
  }

  async addContact(userId: string): Promise<void> {
    await http.post(API_ROUTES.users.addContact(userId));
    window.dispatchEvent(new CustomEvent("contact:added"));
  }

  async removeContact(userId: string): Promise<void> {
    await http.delete(API_ROUTES.contacts.detail(userId));
    this.contacts = this.contacts.filter(c => c.id !== Number(userId));
    window.dispatchEvent(new CustomEvent("contact:removed"));
  }

  async getUserDetail(userId: string): Promise<UserDetail> {
    return await http.get<UserDetail>(API_ROUTES.users.detail(userId));
  }
}

export const contactStore = new ContactStore();
