import { QrCode, Users, ArrowLeftRight, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    icon: QrCode,
    label: 'Scan QR',
    color: 'from-primary to-primary-glow',
    path: '/scan',
  },
  {
    icon: Users,
    label: 'Pay Contacts',
    color: 'from-accent to-success',
    path: '/pay',
  },
  {
    icon: ArrowLeftRight,
    label: 'Self Transfer',
    color: 'from-amber-500 to-orange-500',
    path: '/transfer',
  },
  {
    icon: Wallet,
    label: 'Check Balance',
    color: 'from-emerald-500 to-teal-500',
    path: '/balance',
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-6">
      <h2 className="font-display font-semibold text-lg text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="icon-button group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <action.icon className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
