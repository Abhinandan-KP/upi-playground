import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Fingerprint,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useUPI } from '@/context/UPIContext';

import { cn } from '@/lib/utils';

const menuItems = [
  { icon: CreditCard, label: 'Linked Bank Accounts', path: '/balance' },
  { icon: Fingerprint, label: 'UPI PIN Settings', path: '#' },
  { icon: Shield, label: 'Security', path: '#' },
  { icon: Settings, label: 'App Settings', path: '#' },
  { icon: HelpCircle, label: 'Help & Support', path: '#' },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useUPI();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-md mx-auto flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display font-semibold text-lg text-foreground">Profile</h1>
        </div>
      </header>

      {/* Profile Card */}
      <div className="px-4 py-6">
        <div className="card-elevated p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-muted-foreground mt-1">{user.upiId}</p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">+91 {user.phoneNumber}</p>
          </div>

          <button className="mt-4 px-6 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4">
        <div className="card-elevated overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors',
                index !== menuItems.length - 1 && 'border-b border-border'
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-foreground" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full mt-4 flex items-center justify-center gap-3 p-4 rounded-2xl bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* App Version */}
      <div className="text-center mt-8">
        <p className="text-xs text-muted-foreground">BharatPay v1.0.0</p>
        <p className="text-xs text-muted-foreground mt-1">Made with ❤️ in India</p>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
