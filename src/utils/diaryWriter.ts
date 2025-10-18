export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  highlights: string[];
  createdAt: Date;
}

class DiaryWriterService {
  private diaryEntries: Map<string, DiaryEntry> = new Map();

  constructor() {
    this.loadDiaryEntries();
    this.addHardcodedEntries();
  }

  private loadDiaryEntries() {
    const stored = localStorage.getItem('reech_diary_entries');
    if (stored) {
      const entries = JSON.parse(stored);
      entries.forEach((entry: any) => {
        this.diaryEntries.set(entry.id, {
          ...entry,
          createdAt: new Date(entry.createdAt)
        });
      });
    }
  }

  private saveDiaryEntries() {
    const entries = Array.from(this.diaryEntries.values());
    localStorage.setItem('reech_diary_entries', JSON.stringify(entries));
  }

  private addHardcodedEntries() {
    // No hardcoded entries - we'll create them dynamically from chat conversations
    console.log('No hardcoded diary entries - will create from chat conversations');
    
    // Clear any existing diary entries from localStorage for testing
    localStorage.removeItem('reech_diary_entries');
    this.diaryEntries.clear();
    
    // Also clear chat history for fresh start
    localStorage.removeItem('reech_chat_messages');
    localStorage.removeItem('reech_journal');
  }

  private async updateExistingDiary(existingEntry: DiaryEntry, newConversations: any[]): Promise<DiaryEntry> {
    // Get new conversations that weren't in the original diary
    const today = '19/10/2025'; // For demo purposes, using the hardcoded today
    const recentConversations = newConversations.filter(conv => conv.date === today);
    
    console.log('=== UPDATING EXISTING DIARY ===');
    console.log('Updating existing diary for:', today);
    console.log('All conversations:', newConversations);
    console.log('Recent conversations for today:', recentConversations);
    console.log('Existing entry content:', existingEntry.content);
    
    if (recentConversations.length === 0) {
      console.log('No new conversations found, returning existing entry');
      return existingEntry;
    }

    console.log('Found new conversations, updating diary...');
    
    // Generate updated content by adding new conversations to existing paragraph
    const updatedContent = await this.updateDiaryContent(existingEntry.content, recentConversations);
    
    console.log('Updated content:', updatedContent);
    
    // Update the existing entry
    existingEntry.content = updatedContent;
    existingEntry.highlights = [...existingEntry.highlights, ...recentConversations.map(conv => conv.text).slice(0, 2)];
    
    this.diaryEntries.set(existingEntry.id, existingEntry);
    this.saveDiaryEntries();
    
    console.log('Diary updated successfully!');
    return existingEntry;
  }

  private async updateDiaryContent(existingContent: string, newConversations: any[]): Promise<string> {
    try {
      const conversationTexts = newConversations.map(conv => conv.text).join(' ');
      
      console.log('=== UPDATING DIARY CONTENT ===');
      console.log('Existing content:', existingContent);
      console.log('New conversations:', conversationTexts);
      
      const prompt = `I have an existing diary entry and some new conversations to add to it. Please update the diary entry by naturally incorporating the new conversations into the existing paragraph, making it flow well and feel like one cohesive entry.

Existing diary entry:
"${existingContent}"

New conversations to add:
"${conversationTexts}"

Please rewrite the diary entry to include the new information. Keep it casual, simple, and human - like a real person talking about their day. No fancy words or literary style. Make it feel like one continuous, natural diary entry.

IMPORTANT: Do NOT mention Reech, AI, chatbot, or any AI assistant in the diary entry. Write it as if the person is talking about their own experiences and thoughts, not about chatting with an AI.`;

      console.log('Sending request to OpenAI...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a casual diary writer. Update existing diary entries by naturally incorporating new conversations into the existing content. Keep it simple, conversational, and human - like a real person talking about their day. No fancy words or literary style. NEVER mention Reech, AI, chatbot, or any AI assistant in the diary entries.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 400,
          temperature: 0.7
        })
      });

      console.log('OpenAI response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const updatedContent = data.choices[0]?.message?.content || existingContent;
      console.log('OpenAI returned updated content:', updatedContent);
      return updatedContent;
    } catch (error) {
      console.error('Error updating diary content:', error);
      // Fallback: just append new conversations
      const fallbackContent = `${existingContent}\n\nLater, I also thought about: ${newConversations.map(conv => conv.text).join('. ')}.`;
      console.log('Using fallback content:', fallbackContent);
      return fallbackContent;
    }
  }

  async generateDailyDiary(date: string, conversations: any[]): Promise<DiaryEntry> {
    const existingEntry = this.diaryEntries.get(date);
    if (existingEntry) {
      // Update existing diary with new conversations
      return this.updateExistingDiary(existingEntry, conversations);
    }

    // Analyze conversations for the day
    const dayConversations = conversations.filter(conv => conv.date === date);
    
    if (dayConversations.length === 0) {
      return this.createEmptyDiaryEntry(date);
    }

    // Extract mood and topics from conversations
    const moods = dayConversations.map(conv => conv.mood).filter(Boolean);
    const dominantMood = this.getDominantMood(moods);
    const topics = this.extractTopics(dayConversations);
    const highlights = this.extractHighlights(dayConversations);

    // Generate diary content using OpenAI
    const diaryContent = await this.generateDiaryContent(dayConversations, dominantMood, topics, highlights);
    
    const diaryEntry: DiaryEntry = {
      id: date,
      date,
      title: diaryContent.title,
      content: diaryContent.content,
      mood: dominantMood || 'neutral',
      highlights,
      createdAt: new Date()
    };

    this.diaryEntries.set(date, diaryEntry);
    this.saveDiaryEntries();
    
    return diaryEntry;
  }

  private createEmptyDiaryEntry(date: string): DiaryEntry {
    return {
      id: date,
      date,
      title: "A Quiet Day",
      content: "Today was a quiet day with no conversations recorded. Sometimes the best days are the ones where we take time to rest and reflect.",
      mood: 'neutral',
      highlights: [],
      createdAt: new Date()
    };
  }

  private getDominantMood(moods: string[]): string {
    if (moods.length === 0) return 'neutral';
    
    const moodCounts: Record<string, number> = {};
    moods.forEach(mood => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    
    return Object.entries(moodCounts).reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b)[0];
  }

  private extractTopics(conversations: any[]): string[] {
    const topics: string[] = [];
    conversations.forEach(conv => {
      const text = conv.text.toLowerCase();
      if (text.includes('work')) topics.push('work');
      if (text.includes('family') || text.includes('mom') || text.includes('dad')) topics.push('family');
      if (text.includes('friend')) topics.push('friends');
      if (text.includes('health') || text.includes('sick') || text.includes('doctor')) topics.push('health');
      if (text.includes('travel') || text.includes('trip') || text.includes('vacation')) topics.push('travel');
      if (text.includes('food') || text.includes('eat') || text.includes('cook')) topics.push('food');
      if (text.includes('exercise') || text.includes('gym') || text.includes('run')) topics.push('fitness');
    });
    return [...new Set(topics)];
  }

  private extractHighlights(conversations: any[]): string[] {
    return conversations
      .filter(conv => conv.text.length > 20) // Only longer conversations
      .map(conv => conv.text)
      .slice(0, 3); // Top 3 highlights
  }

  private async generateDiaryContent(conversations: any[], mood: string, topics: string[], highlights: string[]): Promise<{title: string, content: string}> {
    try {
      const conversationSummary = conversations.map(conv => conv.text).join(' ');
      const topicsStr = topics.join(', ');
      const highlightsStr = highlights.join(' | ');

      const prompt = `Write a casual, human diary entry based on these conversations:

Date: ${conversations[0]?.date || 'Today'}
Mood: ${mood}
Topics discussed: ${topicsStr}
Key highlights: ${highlightsStr}

Conversations: ${conversationSummary}

Please write:
1. A simple, casual title for the day
2. A short, natural diary entry that sounds like a real person wrote it. Keep it simple, conversational, and human. No fancy words or literary style - just like someone talking about their day to a friend.

IMPORTANT: Do NOT mention Reech, AI, chatbot, or any AI assistant in the diary entry. Write it as if the person is talking about their own experiences and thoughts, not about chatting with an AI.

Format as JSON:
{
  "title": "Simple title here",
  "content": "Casual diary entry here"
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a casual diary writer. Write simple, human diary entries based on conversations. Keep it conversational and natural - like a real person talking about their day. No fancy words or literary style. NEVER mention Reech, AI, chatbot, or any AI assistant in the diary entries. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (content) {
        try {
          return JSON.parse(content);
        } catch {
          // Fallback if JSON parsing fails
          return {
            title: `A ${mood} Day`,
            content: content
          };
        }
      }
    } catch (error) {
      console.error('Error generating diary content:', error);
    }

    // Fallback content
    return {
      title: `A ${mood} Day`,
      content: `Today was a ${mood} day. ${conversations.length > 0 ? 'I had some interesting conversations and experiences.' : 'It was a quiet day.'} ${topics.length > 0 ? `The main topics on my mind were ${topics.join(', ')}.` : ''} ${mood !== 'neutral' ? `I was feeling quite ${mood} throughout the day.` : ''}`
    };
  }

  getDiaryEntry(date: string): DiaryEntry | undefined {
    return this.diaryEntries.get(date);
  }

  getAllDiaryEntries(): DiaryEntry[] {
    return Array.from(this.diaryEntries.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  updateDiaryEntry(updatedEntry: DiaryEntry): void {
    this.diaryEntries.set(updatedEntry.id, updatedEntry);
    this.saveDiaryEntries();
  }

  deleteDiaryEntry(entryId: string): void {
    this.diaryEntries.delete(entryId);
    this.saveDiaryEntries();
  }

  async generateTodayDiary(): Promise<DiaryEntry> {
    // Use the same date format as our hardcoded entries (DD/MM/YYYY)
    const today = '19/10/2025'; // For demo purposes, using the hardcoded today
    const conversations = JSON.parse(localStorage.getItem('reech_journal') || '[]');
    console.log('Generating today diary for:', today);
    console.log('Found conversations:', conversations);
    console.log('Conversations for today:', conversations.filter(conv => conv.date === today));
    return this.generateDailyDiary(today, conversations);
  }
}

export const diaryWriterService = new DiaryWriterService();
