// API route for diary generation
export async function POST(request: Request) {
  try {
    const { conversations, mood, topics, highlights, date } = await request.json();
    
    if (!conversations || conversations.length === 0) {
      return Response.json({ error: 'Conversations are required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const conversationSummary = conversations.map((conv: any) => conv.text).join(' ');
    const topicsStr = topics?.join(', ') || '';
    const highlightsStr = highlights?.join(' | ') || '';

    const prompt = `Write a casual, human diary entry based on these conversations:

Date: ${date || 'Today'}
Mood: ${mood || 'neutral'}
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
        'Authorization': `Bearer ${apiKey}`
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
        max_tokens: 400,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    try {
      const diaryData = JSON.parse(content);
      return Response.json(diaryData);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return Response.json({
        title: date || 'Today',
        content: content || 'Had a good day today.'
      });
    }

  } catch (error) {
    console.error('Diary API error:', error);
    return Response.json({ 
      error: 'Failed to generate diary entry' 
    }, { status: 500 });
  }
}
