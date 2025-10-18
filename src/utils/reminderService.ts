export interface Reminder {
  id: string;
  text: string;
  time?: string;
  date: string;
  timestamp: number;
  completed: boolean;
  scheduledTime?: Date;
  reminderTimes: Date[];
  reminderMessages: string[];
}

class ReminderService {
  private reminders: Map<string, Reminder> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('reech_reminders');
    if (stored) {
      const reminders = JSON.parse(stored);
      reminders.forEach((reminder: Reminder) => {
        this.reminders.set(reminder.id, reminder);
        if (reminder.scheduledTime && !reminder.completed) {
          this.scheduleReminder(reminder);
        }
      });
    }
  }

  private saveToStorage() {
    const reminders = Array.from(this.reminders.values());
    localStorage.setItem('reech_reminders', JSON.stringify(reminders));
  }

  createReminder(text: string, scheduledTime: Date): Reminder {
    const id = Date.now().toString();
    
    // Calculate the 3 reminder times dynamically
    const reminderTimes = this.calculateReminderTimes(scheduledTime);
    const reminderMessages = this.generateReminderMessages(text, scheduledTime);
    
    const reminder: Reminder = {
      id,
      text,
      scheduledTime,
      time: scheduledTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      completed: false,
      reminderTimes,
      reminderMessages
    };

    this.reminders.set(id, reminder);
    this.scheduleAllReminders(reminder);
    this.saveToStorage();
    
    return reminder;
  }

  private calculateReminderTimes(scheduledTime: Date): Date[] {
    const now = new Date();
    const times: Date[] = [];
    const timeUntilReminder = scheduledTime.getTime() - now.getTime();
    
    // If reminder is very soon (less than 2 minutes), just send it at the scheduled time
    if (timeUntilReminder < 2 * 60 * 1000) {
      times.push(scheduledTime);
      return times;
    }
    
    // 1 hour before (only if more than 1 hour away)
    const oneHourBefore = new Date(scheduledTime.getTime() - 60 * 60 * 1000);
    if (oneHourBefore > now) {
      times.push(oneHourBefore);
    }
    
    // 15 minutes before (only if more than 15 minutes away)
    const fifteenMinBefore = new Date(scheduledTime.getTime() - 15 * 60 * 1000);
    if (fifteenMinBefore > now) {
      times.push(fifteenMinBefore);
    }
    
    // At the scheduled time (always)
    times.push(scheduledTime);
    
    return times;
  }

  private generateReminderMessages(text: string, scheduledTime: Date): string[] {
    const timeStr = scheduledTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const now = new Date();
    const timeUntilReminder = scheduledTime.getTime() - now.getTime();
    const isEvening = scheduledTime.getHours() >= 18;
    
    // If reminder is very soon (less than 2 minutes), use a different message
    if (timeUntilReminder < 2 * 60 * 1000) {
      return [
        `Quick reminder! "${text}" at ${timeStr} - Get ready! ⚡`
      ];
    }
    
    return [
      // 1 hour before
      isEvening 
        ? `Hey! Hope you're not getting sleepy 😴 Your reminder "${text}" is in 1 hour at ${timeStr}. Time to get ready!`
        : `Hey! Your reminder "${text}" is in 1 hour at ${timeStr}. Time to get ready!`,
      
      // 15 minutes before
      `Reminder in 15 minutes! "${text}" at ${timeStr} 🚀`,
      
      // At scheduled time
      `Time for your reminder! "${text}" - Hope you're ready! ⏰`
    ];
  }

  private scheduleAllReminders(reminder: Reminder) {
    const now = new Date();
    
    console.log('Scheduling reminders for:', reminder.text);
    console.log('Scheduled time:', reminder.scheduledTime);
    console.log('Reminder times:', reminder.reminderTimes);
    
    // Schedule each reminder time
    reminder.reminderTimes.forEach((reminderTime, index) => {
      const delay = reminderTime.getTime() - now.getTime();
      
      console.log(`Reminder ${index}: ${reminderTime}, delay: ${delay}ms`);
      
      if (delay > 0) {
        const timeout = setTimeout(() => {
          console.log('Sending reminder:', reminder.text, 'index:', index);
          this.sendReminderNotification(reminder, index);
        }, delay);
        this.intervals.set(`${reminder.id}_${index}`, timeout);
      } else {
        console.log('Skipping reminder in the past:', reminderTime);
      }
    });
  }

  private sendReminderNotification(reminder: Reminder, messageIndex: number) {
    const message = reminder.reminderMessages[messageIndex] || `Don't forget: ${reminder.text}`;
    
    // Dispatch custom event for UI updates (WhatsApp-style message)
    window.dispatchEvent(new CustomEvent('reminderNotification', {
      detail: { reminder, message, messageIndex }
    }));
  }

  markReminderCompleted(reminderId: string): boolean {
    const reminder = this.reminders.get(reminderId);
    if (!reminder) return false;

    reminder.completed = true;
    
    // Clear all timeouts for this reminder
    reminder.reminderTimes.forEach((_, index) => {
      const timeout = this.intervals.get(`${reminderId}_${index}`);
      if (timeout) {
        clearTimeout(timeout);
        this.intervals.delete(`${reminderId}_${index}`);
      }
    });

    this.saveToStorage();
    return true;
  }

  getActiveReminders(): Reminder[] {
    return Array.from(this.reminders.values())
      .filter(r => !r.completed)
      .sort((a, b) => (a.scheduledTime?.getTime() || 0) - (b.scheduledTime?.getTime() || 0));
  }

  getCompletedReminders(): Reminder[] {
    return Array.from(this.reminders.values())
      .filter(r => r.completed)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

}

export const reminderService = new ReminderService();
