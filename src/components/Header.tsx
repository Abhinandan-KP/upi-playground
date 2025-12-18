import { Bell } from 'lucide-react';
import { useUPI } from '@/context/UPIContext';

export function Header() {
  const { user } = useUPI();

  return (
    
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-display font-semibold text-foreground">{user.name.split(' ')[0]}</p>
          </div>
        </div>
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors duration-200">
          <Bell className="w-6 h-6 text-foreground" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
        </button>
      </div>
    </header>
  );
}
