# Reech AI - Your Friendly Personal Assistant

A WhatsApp-like chatbot powered by OpenAI that helps you manage reminders, journal your thoughts, and provides intelligent conversation.

## Features

### 🤖 **Intelligent AI Chat**
- Powered by OpenAI GPT-3.5-turbo for natural, friendly conversations
- Context-aware responses that understand your mood and situation
- Empathetic and supportive personality

### 📝 **Smart Reminders**
- Natural language reminder detection ("I have a meeting at 11pm")
- Automatic time parsing and scheduling
- Browser notifications (with permission)
- Completion tracking with journal integration

### 📖 **Personal Journal**
- Automatic mood detection from your messages
- All conversations saved as journal entries
- Easy access via the journal button in chat header
- Reminder completions logged with your responses

### 💬 **WhatsApp-like Interface**
- Familiar chat interface
- Real-time typing indicators
- Message timestamps
- Responsive design

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key:
     ```
     VITE_OPENAI_API_KEY=your_openai_api_key_here
     ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Usage Examples

### Setting a Reminder
```
You: "I have a doctor's appointment tomorrow at 2pm"
Reech: "Got it! I'll remind you about your doctor's appointment tomorrow at 2:00 PM. I'll make sure you don't miss it! 📅"
```

### Journal Entry
```
You: "I'm feeling really stressed about work today"
Reech: "I can hear that work is really weighing on you right now. That stress can be overwhelming, but you're doing great by acknowledging it. Is there anything specific about work that's been particularly challenging today? 💭"
```

### Completing a Reminder
```
Reech: "Don't forget: I have a doctor's appointment tomorrow at 2pm"
You: "Yes, I'm done with the appointment"
Reech: "Awesome! I'm glad your doctor's appointment went well. I've marked it as completed and added it to your journal. How did everything go? 🎉"
```

## Technical Details

### AI Integration
- Uses OpenAI's GPT-3.5-turbo model
- Context-aware system prompts
- Optimized for friendly, supportive responses
- Error handling with fallback responses

### Reminder System
- Background scheduling with `setTimeout`
- Browser notification API integration
- Persistent storage using localStorage
- Smart time parsing for various formats

### Data Storage
- All data stored locally in browser
- Journal entries with mood detection
- Reminder management with completion tracking
- No external database required

## File Structure

```
src/
├── components/          # UI components
├── pages/              # Main pages (Chat, Journal, etc.)
├── utils/
│   ├── openaiService.ts    # OpenAI API integration
│   ├── reminderService.ts  # Reminder management
│   ├── messageParser.ts    # Natural language processing
│   └── storage.ts          # Local storage utilities
└── hooks/              # Custom React hooks
```

## Environment Variables

- `VITE_OPENAI_API_KEY`: Your OpenAI API key (required)

## Browser Support

- Modern browsers with ES6+ support
- Notification API support for reminders
- Local storage support for data persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes."# Reech" 
"# Reech_11" 
"# reech_" 
