import { Archive, MessageCircle } from "lucide-react";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isGroup?: boolean;
  status?: string;
}

const ChatList = ({ onSelectChat }: { onSelectChat: (chat: Chat) => void }) => {
  const chats: Chat[] = [
    {
      id: "1",
      name: "Reech AI",
      avatar: "R",
      lastMessage: "I've added that to your journal 📝",
      time: "4:46 PM",
      unread: 2,
      status: "Always here for you",
    },
    {
      id: "2",
      name: "Sarah Stephen",
      avatar: "S",
      lastMessage: "Feeling great about today's progress!",
      time: "2:33 PM",
      unread: 6,
      isGroup: true,
    },
    {
      id: "3",
      name: "Michael Chen",
      avatar: "M",
      lastMessage: "Call mom at 5 PM",
      time: "8/31/2025",
    },
  ];

  return (
    <div className="w-full h-full bg-whatsapp-panel flex flex-col">
      {/* Header */}
      <div className="p-4 bg-whatsapp-header border-b border-whatsapp-border">
        <h1 className="text-xl font-semibold text-foreground">Chats</h1>
      </div>

      {/* Archived banner */}
      <div className="px-4 py-3 border-b border-whatsapp-border hover:bg-whatsapp-hover cursor-pointer transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-whatsapp-hover flex items-center justify-center">
            <Archive className="w-5 h-5 text-whatsapp-icon" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Archived</p>
            <p className="text-xs text-whatsapp-preview">3 chats</p>
          </div>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className="px-4 py-3 border-b border-whatsapp-border hover:bg-whatsapp-hover cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-whatsapp-green to-accent flex items-center justify-center text-white font-semibold flex-shrink-0">
                {chat.avatar}
              </div>

              {/* Chat info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-[15px] font-medium text-foreground truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-whatsapp-time ml-2 flex-shrink-0">
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-whatsapp-preview truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unread && (
                    <span className="ml-2 bg-whatsapp-green text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
