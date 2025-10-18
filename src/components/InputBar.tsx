import { useState } from "react";
import { Plus, Smile, Mic } from "lucide-react";
import { Button } from "./ui/button";

interface InputBarProps {
  onSend: (message: string) => void;
}

const InputBar = ({ onSend }: InputBarProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-whatsapp-header p-2 flex items-center gap-2"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-whatsapp-icon hover:bg-whatsapp-hover rounded-full h-10 w-10"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <div className="flex-1 bg-whatsapp-panel rounded-lg flex items-center px-3 py-2 gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-whatsapp-icon hover:bg-transparent h-8 w-8 p-0"
        >
          <Smile className="w-6 h-6" />
        </Button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-transparent text-foreground text-[15px] placeholder:text-whatsapp-icon focus:outline-none"
        />
      </div>

      <Button
        type={message.trim() ? "submit" : "button"}
        variant="ghost"
        size="icon"
        className="text-whatsapp-icon hover:bg-whatsapp-hover rounded-full h-10 w-10"
      >
        <Mic className="w-6 h-6" />
      </Button>
    </form>
  );
};

export default InputBar;
