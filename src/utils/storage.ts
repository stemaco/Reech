export interface JournalEntry {
  id: string;
  text: string;
  mood?: string;
  date: string;
  timestamp: number;
}

export interface Reminder {
  id: string;
  text: string;
  time?: string;
  date: string;
  timestamp: number;
  completed: boolean;
}

export const saveJournalEntry = (entry: Omit<JournalEntry, "id" | "timestamp">) => {
  const entries = getJournalEntries();
  const newEntry: JournalEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  entries.push(newEntry);
  localStorage.setItem("reech_journal", JSON.stringify(entries));
  return newEntry;
};

export const getJournalEntries = (): JournalEntry[] => {
  const stored = localStorage.getItem("reech_journal");
  return stored ? JSON.parse(stored) : [];
};

export const saveReminder = (reminder: Omit<Reminder, "id" | "timestamp">) => {
  const reminders = getReminders();
  const newReminder: Reminder = {
    ...reminder,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  reminders.push(newReminder);
  localStorage.setItem("reech_reminders", JSON.stringify(reminders));
  return newReminder;
};

export const getReminders = (): Reminder[] => {
  const stored = localStorage.getItem("reech_reminders");
  return stored ? JSON.parse(stored) : [];
};

export const toggleReminder = (id: string) => {
  const reminders = getReminders();
  const updated = reminders.map((r) =>
    r.id === id ? { ...r, completed: !r.completed } : r
  );
  localStorage.setItem("reech_reminders", JSON.stringify(updated));
  return updated;
};

export const deleteReminder = (id: string) => {
  const reminders = getReminders();
  const filtered = reminders.filter((r) => r.id !== id);
  localStorage.setItem("reech_reminders", JSON.stringify(filtered));
  return filtered;
};
