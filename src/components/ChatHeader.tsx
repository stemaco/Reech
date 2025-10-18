import { Video, Search, MoreVertical, BookOpen, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface ChatHeaderProps {
  name: string;
  avatar: string;
  status?: string;
  onClearChat?: () => void;
}

const ChatHeader = ({ name, avatar, status, onClearChat }: ChatHeaderProps) => {
  return (
    <header className="bg-whatsapp-header border-b border-whatsapp-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-whatsapp-green to-accent flex items-center justify-center text-white font-semibold">
          {avatar}
        </div>
        <div>
          <h2 className="font-medium text-foreground">{name}</h2>
          {status && (
            <p className="text-xs text-whatsapp-preview">{status}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/journal">
          <Button
            variant="ghost"
            size="icon"
            className="text-whatsapp-icon hover:bg-whatsapp-hover rounded-full"
            title="View Journal"
          >
            <BookOpen className="w-5 h-5" />
          </Button>
        </Link>
        {onClearChat && (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100 hover:text-red-600 rounded-full"
            title="Clear Chat History"
            onClick={onClearChat}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-whatsapp-icon hover:bg-whatsapp-hover rounded-full"
        >
          <Video className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-whatsapp-icon hover:bg-whatsapp-hover rounded-full"
        >
          <Search className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-whatsapp-icon hover:bg-whatsapp-hover rounded-full"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
