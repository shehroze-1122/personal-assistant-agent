import { people_v1 } from "googleapis";

export const getContacts = async (peopleClient: people_v1.People) => {
  try {
    const contacts = await peopleClient.people.connections.list({
      resourceName: "people/me",
      personFields: "names,emailAddresses",
    });
    return contacts.data.connections;
  } catch (error) {
    console.error("Error getting contacts");
    throw error;
  }
};

export const getContactEmailAddress = async (
  peopleClient: people_v1.People,
  contactName: string
) => {
  const contacts = await getContacts(peopleClient);
  const lowerCasedContactName = contactName.toLowerCase();

  if (!contacts) return null;
  const contact = contacts.find((contact) => {
    const currentName = contact.names?.[0].displayName?.toLowerCase();
    if (
      currentName === lowerCasedContactName ||
      currentName?.includes(lowerCasedContactName)
    ) {
      return true;
    }
    return false;
  });
  return contact?.emailAddresses?.[0]?.value || null;
};
