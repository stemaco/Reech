import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  time: string;
}

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
}

const ChatWindow = ({ messages, isTyping }: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto py-4 bg-whatsapp-chatBg"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Welcome message */}
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center px-6">
          <div className="bg-gradient-to-br from-whatsapp-green to-accent w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg">
            R
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Reech 🧠
          </h2>
          <p className="text-whatsapp-preview max-w-md">
            Chat with me like you would on WhatsApp. I'll remember important things, set reminders, and keep a journal for you automatically.
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          type={message.type}
          text={message.text}
          time={message.time}
        />
      ))}

      {/* Typing indicator */}
      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default ChatWindow;
