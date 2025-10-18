import { NavLink } from "react-router-dom";
import { MessageCircle, BookOpen, Bell, Settings } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: MessageCircle, label: "Chat" },
    { to: "/journal", icon: BookOpen, label: "Journal" },
    { to: "/reminders", icon: Bell, label: "Reminders" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 gap-8">
      {/* Logo */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground animate-pulse-glow">
        R
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-6 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `p-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`
            }
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
            {/* Tooltip */}
            <span className="absolute left-full ml-4 px-3 py-1 bg-card rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
