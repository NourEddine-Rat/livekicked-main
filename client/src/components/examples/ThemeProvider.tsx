import { ThemeProvider, useTheme } from '../ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4 space-y-4 bg-background text-foreground">
        <h2 className="text-lg font-semibold">Theme Provider Example</h2>
        <p className="text-muted-foreground">Toggle between light and dark mode:</p>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}