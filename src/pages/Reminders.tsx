import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getReminders, toggleReminder, deleteReminder, Reminder } from "../utils/storage";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const loadReminders = () => {
    setReminders(getReminders().reverse());
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleToggle = (id: string) => {
    toggleReminder(id);
    loadReminders();
  };

  const handleDelete = (id: string) => {
    deleteReminder(id);
    loadReminders();
  };

  if (reminders.length === 0) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center text-center p-6">
        <Bell className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Reminders</h2>
        <p className="text-muted-foreground max-w-md">
          Tell Reech to remind you about something, and it'll show up here.
        </p>
      </div>
    );
  }

  const activeReminders = reminders.filter((r) => !r.completed);
  const completedReminders = reminders.filter((r) => r.completed);

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">🔔 Your Reminders</h1>
        <p className="text-muted-foreground">
          {activeReminders.length} active, {completedReminders.length} completed
        </p>
      </header>

      <div className="max-w-3xl space-y-8">
        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Active</h2>
            <div className="space-y-3">
              {activeReminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-primary/30 p-4 rounded-xl flex items-start justify-between group hover:border-primary/60 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-foreground leading-relaxed mb-2">{reminder.text}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{reminder.date}</span>
                      {reminder.time && (
                        <>
                          <span>•</span>
                          <span className="text-primary font-medium">{reminder.time}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => handleToggle(reminder.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(reminder.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Completed</h2>
            <div className="space-y-3">
              {completedReminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border p-4 rounded-xl flex items-start justify-between opacity-60"
                >
                  <div className="flex-1">
                    <p className="text-foreground line-through leading-relaxed mb-2">
                      {reminder.text}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{reminder.date}</span>
                      {reminder.time && (
                        <>
                          <span>•</span>
                          <span>{reminder.time}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
