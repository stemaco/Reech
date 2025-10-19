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
      const response = await fetch('/api/diary-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          existingContent,
          newConversations
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.content || existingContent;

    } catch (error) {
      console.error('Error updating diary content:', error);
      // Fallback: just append new conversations
      const fallbackContent = `${existingContent}\n\nLater, I also thought about: ${newConversations.map(conv => conv.text).join('. ')}.`;
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
      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversations,
          mood,
          topics,
          highlights,
          date: conversations[0]?.date || 'Today'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return {
        title: data.title || `A ${mood} Day`,
        content: data.content || 'Had a good day today.'
      };

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
