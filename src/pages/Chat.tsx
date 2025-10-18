import { useState, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";
import ChatHeader from "../components/ChatHeader";
import ChatList from "../components/ChatList";
import { parseMessage, getMoodEmoji, cleanUpMessage } from "../utils/messageParser";
import { saveJournalEntry } from "../utils/storage";
import { openaiService } from "../utils/openaiService";
import { Trash2 } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  time: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState({
    name: "Reech AI",
    avatar: "R",
    status: "Your AI companion • Click 📖 to view your diary",
  });

  useEffect(() => {
    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem('reech_chat_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add welcome message if no messages exist
      const welcomeMessage: Message = {
        id: "welcome",
        type: "bot",
        text: "Yo! What's up dude! I'm Reech, your AI bro 🤖\n\nI'm here to chat with you about whatever's on your mind. I'll remember our conversations and write simple daily diaries for you based on what we talk about.\n\nJust tell me about your day, your thoughts, whatever - I'm here to listen and be your supportive bro. What's going on in your world today?",
        time: formatTime(),
      };
      setMessages([welcomeMessage]);
    }
    
  }, []);

  const formatTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    console.log('Formatting time:', timeString, 'from date:', now);
    return timeString;
  };

  const handleSendMessage = async (text: string) => {
    // Clean up the message for typos
    const cleanedText = cleanUpMessage(text);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: cleanedText, // Use cleaned text for display
      time: formatTime(),
    };

    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      localStorage.setItem('reech_chat_messages', JSON.stringify(newMessages));
      return newMessages;
    });

    // Parse the cleaned message for mood detection
    const parsed = parseMessage(cleanedText);

    // Show typing indicator
    setIsTyping(true);

    let botResponse = "";

    try {
      // Save conversation as journal entry (use cleaned text)
      saveJournalEntry({
        text: cleanedText,
        mood: parsed.mood,
        date: '19/10/2025', // For demo purposes, using the hardcoded today
      });

      // Generate AI response for conversation
      botResponse = await openaiService.generateJournalResponse(cleanedText, parsed.mood);
    } catch (error) {
      console.error('Error generating response:', error);
      botResponse = "I'm having a little trouble thinking right now, but I'm still here! Could you try again? 🤔";
    }

    setIsTyping(false);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      text: botResponse,
      time: formatTime(),
    };

    setMessages((prev) => {
      const newMessages = [...prev, botMessage];
      localStorage.setItem('reech_chat_messages', JSON.stringify(newMessages));
      return newMessages;
    });
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('reech_chat_messages');
    localStorage.removeItem('reech_journal');
    
    // Add welcome message back
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      text: "Yo! What's up dude! I'm Reech, your AI bro 🤖\n\nI'm here to chat with you about whatever's on your mind. I'll remember our conversations and write simple daily diaries for you based on what we talk about.\n\nJust tell me about your day, your thoughts, whatever - I'm here to listen and be your supportive bro. What's going on in your world today?",
      time: formatTime(),
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="flex h-screen bg-whatsapp-bg">
      {/* Left sidebar - Chat list */}
      <div className="w-[400px] border-r border-whatsapp-border">
        <ChatList onSelectChat={(chat) => setSelectedChat({ 
          name: chat.name, 
          avatar: chat.avatar, 
          status: chat.status || "click here for contact info" 
        })} />
      </div>

      {/* Right side - Active chat */}
      <div className="flex-1 flex flex-col">
        <ChatHeader
          name={selectedChat.name}
          avatar={selectedChat.avatar}
          status={selectedChat.status}
          onClearChat={clearChatHistory}
        />
        <ChatWindow messages={messages} isTyping={isTyping} />
        <InputBar onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;
