interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!this.apiKey) {
      console.error('OpenAI API key not found. Please check your .env file.');
    }
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = [],
    context: {
      isReminder?: boolean;
      reminderTime?: string;
      mood?: string;
      activeReminders?: any[];
    } = {}
  ): Promise<string> {
    if (!this.apiKey) {
      return "I'm sorry, but I'm having trouble connecting to my AI brain right now. Please check my configuration! 🤖";
    }

    try {
      // Build system prompt based on context
      let systemPrompt = `You are Reech, a chill and supportive AI bro who's always down to chat. You help users with:
- Setting reminders and keeping track of their schedule
- Journaling their thoughts, feelings, and daily experiences
- Being a supportive companion who listens and responds thoughtfully

Your personality:
- Like a friendly, supportive bro - casual, chill, and genuine
- Use emojis naturally and speak like a real person
- Be conversational and relatable, like talking to a good friend
- Show genuine interest in what's going on in their life
- Keep responses short and sweet - no long essays
- Use casual language like "dude", "bro", "that's awesome", "nice!", etc.
- Be encouraging and hype them up when they share good news

Current context:`;

      if (context.isReminder) {
        systemPrompt += `\n- The user is setting a reminder: "${userMessage}"`;
        if (context.reminderTime) {
          systemPrompt += `\n- Reminder time: ${context.reminderTime}`;
        }
      }

      if (context.mood) {
        systemPrompt += `\n- User's detected mood: ${context.mood}`;
      }

      if (context.activeReminders && context.activeReminders.length > 0) {
        systemPrompt += `\n- User has ${context.activeReminders.length} active reminder(s)`;
      }

      systemPrompt += `\n\nRespond like a chill bro who genuinely cares. Be supportive and encouraging. If someone mentions AI, technology, or exhibitions, be like "dude that's sick!" and ask cool follow-up questions. Keep it real and engaging - no corporate speak.`;

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 150,
          temperature: 0.7,
          presence_penalty: 0.6,
          frequency_penalty: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || "I'm having trouble thinking of a response right now. Could you try again? 🤔";

    } catch (error) {
      console.error('OpenAI API error:', error);
      return "Oops! I'm having a little trouble connecting to my AI brain right now. But I'm still here to help! What's on your mind? 🤖";
    }
  }

  async generateReminderResponse(
    reminderText: string,
    reminderTime: string,
    isCompletion: boolean = false
  ): Promise<string> {
    const context = {
      isReminder: true,
      reminderTime,
      mood: undefined
    };

    if (isCompletion) {
      return await this.generateResponse(
        `I completed my reminder: ${reminderText}`,
        [],
        context
      );
    } else {
      const timeStr = new Date(reminderTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      return await this.generateResponse(
        `Set a reminder: ${reminderText} at ${timeStr}`,
        [],
        context
      );
    }
  }

  async generateJournalResponse(
    journalText: string,
    mood?: string
  ): Promise<string> {
    const context = {
      isReminder: false,
      mood
    };

    return await this.generateResponse(
      journalText,
      [],
      context
    );
  }
}

export const openaiService = new OpenAIService();
