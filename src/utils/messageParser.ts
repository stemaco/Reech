export interface ParsedMessage {
  type: "reminder" | "journal" | "general";
  text: string;
  reminderTime?: string;
  mood?: string;
}

export const parseMessage = (message: string): ParsedMessage => {
  const lowerMsg = message.toLowerCase();

  // Enhanced reminder detection
  const reminderPatterns = [
    /remind me/i,
    /reminder/i,
    /don't forget/i,
    /don't let me forget/i,
    /remember to/i,
    /set a reminder/i,
    /schedule/i,
    /at \d/i,
    /tomorrow/i,
    /tonight/i,
    /later/i,
    /in \d+ (minute|hour|day)/i,
    /next (week|month|year)/i,
    /meeting/i,
    /call/i,
    /appointment/i,
    /deadline/i
  ];

  const isReminder = reminderPatterns.some(pattern => pattern.test(message));

  if (isReminder) {
    // Extract time if mentioned
    const timePatterns = [
      /(\d{1,2}:\d{2})\s*(am|pm)?/i,
      /(\d{1,2})\s*(am|pm)/i,
      /(tomorrow|tonight|later)/i,
      /(in \d+ (minute|hour|day)s?)/i,
      /(next (week|month|year))/i,
      /(morning|afternoon|evening|night)/i
    ];

    let extractedTime = "";
    for (const pattern of timePatterns) {
      const match = message.match(pattern);
      if (match) {
        extractedTime = match[0];
        break;
      }
    }

    return {
      type: "reminder",
      text: message,
      reminderTime: extractedTime || undefined,
    };
  }

  // Detect mood from message
  const moodKeywords = {
    happy: ["happy", "great", "awesome", "excited", "love", "amazing"],
    sad: ["sad", "down", "upset", "crying", "depressed"],
    stressed: ["stressed", "anxious", "worried", "overwhelmed", "pressure"],
    tired: ["tired", "exhausted", "sleepy", "drained"],
    grateful: ["grateful", "thankful", "blessed", "appreciate"],
  };

  let detectedMood = "";
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some((keyword) => lowerMsg.includes(keyword))) {
      detectedMood = mood;
      break;
    }
  }

  return {
    type: "journal",
    text: message,
    mood: detectedMood,
  };
};

export const getMoodEmoji = (mood?: string): string => {
  const moodEmojis: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    stressed: "😰",
    tired: "😴",
    grateful: "🙏",
    excited: "🤩",
    accomplished: "💪",
    motivated: "🚀",
    content: "😌",
  };
  return mood ? moodEmojis[mood] || "💭" : "💭";
};

export const cleanUpMessage = (message: string): string => {
  // Common typo corrections
  const corrections: Record<string, string> = {
    'exhibiton': 'exhibition',
    'greate': 'great',
    'a Ai': 'an AI',
    'a ai': 'an AI',
    'recieve': 'receive',
    'seperate': 'separate',
    'definately': 'definitely',
    'occured': 'occurred',
    'begining': 'beginning',
    'neccessary': 'necessary'
  };

  let cleanedMessage = message;
  
  // Apply corrections
  Object.entries(corrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    cleanedMessage = cleanedMessage.replace(regex, correct);
  });

  return cleanedMessage;
};

export const parseTimeToDate = (timeString: string): Date | null => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Handle specific times like "11pm", "11:30pm", "23:00"
  const timeMatch = timeString.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const ampm = timeMatch[3]?.toLowerCase();
    
    if (ampm === 'pm' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'am' && hours === 12) {
      hours = 0;
    }
    
    const scheduledDate = new Date(today);
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }
    
    return scheduledDate;
  }
  
  // Handle relative times
  if (timeString.toLowerCase().includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  if (timeString.toLowerCase().includes('tonight')) {
    const tonight = new Date(today);
    tonight.setHours(20, 0, 0, 0); // 8 PM
    if (tonight <= now) {
      tonight.setDate(tonight.getDate() + 1);
    }
    return tonight;
  }
  
  return null;
};
