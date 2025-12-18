import { Home, Clock, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Clock, label: 'History', path: '/history' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'bottom-nav-item',
                isActive && 'active'
              )}
            >
              <item.icon
                className={cn(
                  'w-6 h-6 transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area for bottom notch */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
}
