import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-2 px-2">
      <div className="bg-whatsapp-botBubble text-foreground px-4 py-3 rounded-lg rounded-tl-none shadow-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-whatsapp-icon rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
