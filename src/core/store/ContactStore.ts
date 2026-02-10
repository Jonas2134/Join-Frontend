import { http } from "../api/HttpClient";
import { API_ROUTES } from "../api/config";
import type { Contact } from "../types/contact.types";

class ContactStore {
  contacts: Contact[] = [];

  async loadContacts(): Promise<Contact[]> {
    this.contacts = await http.get<Contact[]>(API_ROUTES.contacts.list);
    return this.contacts;
  }

  async searchUsers(query: string): Promise<Contact[]> {
    return await http.get<Contact[]>(`${API_ROUTES.users.list}?search=${encodeURIComponent(query)}`);
  }
}

export const contactStore = new ContactStore();
