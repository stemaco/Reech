import { motion } from "framer-motion";

interface ChatBubbleProps {
  type: "user" | "bot";
  text: string;
  time?: string;
}

const ChatBubble = ({ type, text, time }: ChatBubbleProps) => {
  const isUser = type === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2 px-2`}
    >
      <div className={`max-w-[65%] ${isUser ? "ml-auto" : "mr-auto"}`}>
        <div
          className={`px-3 py-2 rounded-lg shadow-sm ${
            isUser
              ? "bg-whatsapp-userBubble text-foreground rounded-tr-none"
              : "bg-whatsapp-botBubble text-foreground rounded-tl-none"
          }`}
        >
          <p className="text-[14.2px] leading-[19px] whitespace-pre-wrap break-words">
            {text}
          </p>
          {time && (
            <div className="flex justify-end mt-1">
              <span className="text-[11px] text-whatsapp-time">
                {time}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
