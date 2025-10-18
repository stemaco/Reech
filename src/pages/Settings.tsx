import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center text-center p-6">
      <SettingsIcon className="w-16 h-16 text-primary mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
      <p className="text-muted-foreground max-w-md">
        Settings and preferences will be available here soon.
      </p>
    </div>
  );
};

export default Settings;
