// API route for chat responses
export async function POST(request: Request) {
  try {
    const { message, conversationHistory = [], context = {} } = await request.json();
    
    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

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
      systemPrompt += `\n- The user is setting a reminder: "${message}"`;
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

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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

    const data = await response.json();
    const botResponse = data.choices[0]?.message?.content || "I'm having trouble thinking of a response right now. Could you try again? 🤔";

    return Response.json({ response: botResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ 
      error: "Oops! I'm having a little trouble connecting to my AI brain right now. But I'm still here to help! What's on your mind? 🤖" 
    }, { status: 500 });
  }
}
