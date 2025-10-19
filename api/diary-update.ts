// API route for diary updates
export async function POST(request: Request) {
  try {
    const { existingContent, newConversations } = await request.json();
    
    if (!existingContent || !newConversations || newConversations.length === 0) {
      return Response.json({ error: 'Existing content and new conversations are required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const conversationTexts = newConversations.map((conv: any) => conv.text).join(' ');
    
    const prompt = `I have an existing diary entry and some new conversations to add to it. Please update the diary entry by naturally incorporating the new conversations into the existing paragraph, making it flow well and feel like one cohesive entry.

Existing diary entry:
"${existingContent}"

New conversations to add:
"${conversationTexts}"

Please rewrite the diary entry to include the new information. Keep it casual, simple, and human - like a real person talking about their day. No fancy words or literary style. Make it feel like one continuous, natural diary entry.

IMPORTANT: Do NOT mention Reech, AI, chatbot, or any AI assistant in the diary entry. Write it as if the person is talking about their own experiences and thoughts, not about chatting with an AI.`;

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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const updatedContent = data.choices[0]?.message?.content || existingContent;

    return Response.json({ content: updatedContent });

  } catch (error) {
    console.error('Diary update API error:', error);
    // Fallback: just append new conversations
    const fallbackContent = `${existingContent}\n\nLater, I also thought about: ${newConversations.map((conv: any) => conv.text).join('. ')}.`;
    return Response.json({ content: fallbackContent });
  }
}
