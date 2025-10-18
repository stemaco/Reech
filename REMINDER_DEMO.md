# Reech AI - Smart Reminder System Demo

## How the 3-Reminder System Works

The reminder system automatically calculates 3 reminder times based on your specified time:

1. **1 hour before** - Early warning
2. **15 minutes before** - Final preparation  
3. **At the scheduled time** - Time to act!

## Example Scenarios

### Scenario 1: "Remind me to call mom in 15 minutes"
**Current time:** 2:00 PM  
**Scheduled time:** 2:15 PM

**Reminders sent:**
- **2:00 PM** (immediately): "Hey! Your reminder 'call mom' is in 1 hour at 2:15 PM. Time to get ready!" *(skipped - less than 1 hour)*
- **2:00 PM** (immediately): "Reminder in 15 minutes! 'call mom' at 2:15 PM 🚀" *(skipped - less than 15 minutes)*
- **2:15 PM**: "Time for your reminder! 'call mom' - Hope you're ready! ⏰"

### Scenario 2: "I have a meeting at 11pm"
**Current time:** 6:00 PM  
**Scheduled time:** 11:00 PM

**Reminders sent:**
- **10:00 PM** (1 hour before): "Hey! Hope you're not getting sleepy 😴 Your reminder 'I have a meeting at 11pm' is in 1 hour at 11:00 PM. Time to get ready!"
- **10:45 PM** (15 minutes before): "Reminder in 15 minutes! 'I have a meeting at 11pm' at 11:00 PM 🚀"
- **11:00 PM** (at scheduled time): "Time for your reminder! 'I have a meeting at 11pm' - Hope you're ready! ⏰"

### Scenario 3: "Remind me to take medicine tomorrow at 9am"
**Current time:** 8:00 PM  
**Scheduled time:** 9:00 AM next day

**Reminders sent:**
- **8:00 AM** (1 hour before): "Hey! Your reminder 'take medicine' is in 1 hour at 9:00 AM. Time to get ready!"
- **8:45 AM** (15 minutes before): "Reminder in 15 minutes! 'take medicine' at 9:00 AM 🚀"
- **9:00 AM** (at scheduled time): "Time for your reminder! 'take medicine' - Hope you're ready! ⏰"

## Key Features

### 🕐 **Dynamic Time Calculation**
- Automatically calculates the 3 reminder times
- Skips reminders that would be in the past
- Works with any time format (11pm, tomorrow, in 2 hours, etc.)

### 🌙 **Smart Context Awareness**
- Evening reminders mention sleepiness
- Different messages for different times of day
- Personalized based on the reminder content

### 🔔 **Multiple Notification Channels**
- Browser desktop notifications
- In-chat messages
- Works even when app is not focused

### ✅ **Completion Tracking**
- Mark reminders as done with "yes", "done", "completed"
- Automatically saves completion to journal
- Clears all pending reminders for that task

## Usage Examples

```
You: "Remind me to submit the report in 2 hours"
Reech: "Got it! I'll remind you about 'submit the report' at 4:00 PM. I'll send you 3 reminders to make sure you don't forget! 📌"

[2 hours later - 3:00 PM]
Reech: "Hey! Your reminder 'submit the report' is in 1 hour at 4:00 PM. Time to get ready!"

[2 hours 45 minutes later - 3:45 PM]  
Reech: "Reminder in 15 minutes! 'submit the report' at 4:00 PM 🚀"

[3 hours later - 4:00 PM]
Reech: "Time for your reminder! 'submit the report' - Hope you're ready! ⏰"

You: "Yes, I submitted it"
Reech: "Awesome! I've marked that as completed and added it to your journal. Great job! 🎉"
```

## Technical Implementation

- **Dynamic Scheduling**: Uses `setTimeout` for each reminder time
- **Smart Filtering**: Only schedules reminders that are in the future
- **Memory Management**: Clears all timeouts when reminder is completed
- **Persistent Storage**: Saves reminders to localStorage
- **Event-Driven**: Uses custom events for UI updates

The system is completely dynamic and works with any time you specify - no hardcoded times!
