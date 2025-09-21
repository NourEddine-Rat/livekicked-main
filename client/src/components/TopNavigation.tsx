import { Button } from "@/components/ui/button";
import { Trophy, Home, Calendar, Settings, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      data-testid="button-theme-toggle"
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Leagues",
    url: "/leagues", 
    icon: Trophy,
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function TopNavigation() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FootballLive</h1>
              <p className="text-xs text-muted-foreground">Live Football Data</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                size="sm"
                onClick={() => console.log(`Navigate to ${item.title}`)}
                className="gap-2"
                data-testid={`nav-${item.title.toLowerCase()}`}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Button>
            ))}
          </nav>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}