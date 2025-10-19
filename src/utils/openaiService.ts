interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  response?: string;
  error?: string;
}

class OpenAIService {
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
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      
      if (data.error) {
        return data.error;
      }

      return data.response || "I'm having trouble thinking of a response right now. Could you try again? 🤔";

    } catch (error) {
      console.error('Chat API error:', error);
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
