export interface SimpleReminder {
  id: string;
  text: string;
  scheduledTime: Date;
  completed: boolean;
  createdAt: Date;
}

class SimpleReminderService {
  private reminders: Map<string, SimpleReminder> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.loadReminders();
  }

  private loadReminders() {
    const stored = localStorage.getItem('simple_reminders');
    if (stored) {
      const reminders = JSON.parse(stored);
      reminders.forEach((reminder: any) => {
        const reminderObj = {
          ...reminder,
          scheduledTime: new Date(reminder.scheduledTime),
          createdAt: new Date(reminder.createdAt)
        };
        this.reminders.set(reminder.id, reminderObj);
        this.scheduleReminder(reminderObj);
      });
    }
  }

  private saveReminders() {
    const reminders = Array.from(this.reminders.values());
    localStorage.setItem('simple_reminders', JSON.stringify(reminders));
  }

  createReminder(text: string, scheduledTime: Date): SimpleReminder {
    const id = Date.now().toString();
    const reminder: SimpleReminder = {
      id,
      text,
      scheduledTime,
      completed: false,
      createdAt: new Date()
    };

    this.reminders.set(id, reminder);
    this.scheduleReminder(reminder);
    this.saveReminders();
    
    console.log('Created reminder:', reminder);
    return reminder;
  }

  private scheduleReminder(reminder: SimpleReminder) {
    const now = new Date();
    const delay = reminder.scheduledTime.getTime() - now.getTime();
    
    console.log('Scheduling reminder:', reminder.text, 'in', delay, 'ms');
    
    if (delay > 0) {
      const timeout = setTimeout(() => {
        this.sendReminder(reminder);
      }, delay);
      this.timeouts.set(reminder.id, timeout);
    } else {
      console.log('Reminder time has passed, not scheduling');
    }
  }

  private sendReminder(reminder: SimpleReminder) {
    console.log('Sending reminder:', reminder.text);
    
    // Send as WhatsApp message
    window.dispatchEvent(new CustomEvent('simpleReminder', {
      detail: {
        text: `🔔 Reminder: ${reminder.text}`,
        reminder
      }
    }));
    
    // Mark as completed
    reminder.completed = true;
    this.saveReminders();
  }

  getActiveReminders(): SimpleReminder[] {
    return Array.from(this.reminders.values())
      .filter(r => !r.completed)
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }

  getCompletedReminders(): SimpleReminder[] {
    return Array.from(this.reminders.values())
      .filter(r => r.completed)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  deleteReminder(id: string) {
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }
    this.reminders.delete(id);
    this.saveReminders();
  }
}

export const simpleReminderService = new SimpleReminderService();
