import { Header } from '@/components/Header';
import { QuickActions } from '@/components/QuickActions';
import { RecentTransactions } from '@/components/RecentTransactions';
import { BottomNav } from '@/components/BottomNav';
import { useUPI } from '@/context/UPIContext';

const Index = () => {
  const { user, getPrimaryAccount } = useUPI();
  
  const primaryAccount = getPrimaryAccount();

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Balance Card */}
      <div className="px-4 py-6">
        <div className="card-elevated p-6 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/5" />
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-accent/5" />

          <div className="relative">
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="font-display text-3xl font-bold text-foreground mb-4">
              {primaryAccount ? formatBalance(primaryAccount.balance) : '₹0.00'}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {user.upiId}
              </span>
              {primaryAccount && (
                <span className="text-xs text-muted-foreground">
                  {primaryAccount.bankName}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <QuickActions />
      <RecentTransactions />
      <BottomNav />
    </div>
  );
};

export default Index;
