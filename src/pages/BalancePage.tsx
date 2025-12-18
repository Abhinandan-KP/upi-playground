import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Building2, RefreshCw } from 'lucide-react';
import { PinEntry } from '@/components/PinEntry';
import { BottomNav } from '@/components/BottomNav';
import { useUPI } from '@/context/UPIContext';
import { BankAccount } from '@/types/upi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BalancePage = () => {
  const navigate = useNavigate();
  const { user, verifyPin } = useUPI();

  const [visibleBalances, setVisibleBalances] = useState<Record<string, boolean>>({});
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(balance);
  };

  const handleCheckBalance = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowPinEntry(true);
  };

  const handlePinSubmit = (pin: string) => {
    if (!verifyPin(pin)) {
      toast.error('Incorrect PIN. Please try again.');
      return;
    }

    if (selectedAccount) {
      setVisibleBalances((prev) => ({
        ...prev,
        [selectedAccount.id]: true,
      }));
    }
    setShowPinEntry(false);
    setSelectedAccount(null);
  };

  const hideBalance = (accountId: string) => {
    setVisibleBalances((prev) => ({
      ...prev,
      [accountId]: false,
    }));
  };

  const handleRefresh = (accountId: string) => {
    setRefreshing(accountId);
    setTimeout(() => {
      setRefreshing(null);
      toast.success('Balance updated');
    }, 1500);
  };

  const totalBalance = user.linkedAccounts.reduce((sum, acc) => sum + acc.balance, 0);

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
          <h1 className="font-display font-semibold text-lg text-foreground">Check Balance</h1>
        </div>
      </header>

      {/* Total Balance Card */}
      <div className="px-4 py-6">
        <div className="card-elevated p-6 gradient-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />

          <div className="relative">
            <p className="text-sm opacity-80 mb-1">Total Balance (All Accounts)</p>
            <p className="font-display text-3xl font-bold">
              {formatBalance(totalBalance)}
            </p>
            <p className="text-sm opacity-80 mt-2">
              {user.linkedAccounts.length} linked {user.linkedAccounts.length === 1 ? 'account' : 'accounts'}
            </p>
          </div>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="px-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Linked Bank Accounts</h2>
        <div className="space-y-3">
          {user.linkedAccounts.map((account, index) => (
            <div
              key={account.id}
              className="card-elevated p-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7 text-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold text-foreground">
                        {account.bankName}
                      </p>
                      <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">IFSC: {account.ifsc}</p>
                    </div>
                    {account.isPrimary && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                        Primary
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      {visibleBalances[account.id] ? (
                        <div className="flex items-center gap-2">
                          <p className="font-display text-xl font-bold text-success">
                            {formatBalance(account.balance)}
                          </p>
                          <button
                            onClick={() => hideBalance(account.id)}
                            className="p-1.5 rounded-full hover:bg-muted transition-colors"
                          >
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      ) : (
                        <p className="font-display text-xl font-bold text-foreground">
                          ₹ ••••••
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {visibleBalances[account.id] && (
                        <button
                          onClick={() => handleRefresh(account.id)}
                          className={cn(
                            'p-2 rounded-full hover:bg-muted transition-colors',
                            refreshing === account.id && 'animate-spin'
                          )}
                        >
                          <RefreshCw className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      {!visibleBalances[account.id] && (
                        <button
                          onClick={() => handleCheckBalance(account)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          <Eye className="w-4 h-4" />
                          Check
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PinEntry
        isOpen={showPinEntry}
        onClose={() => {
          setShowPinEntry(false);
          setSelectedAccount(null);
        }}
        onSubmit={handlePinSubmit}
      />

      <BottomNav />
    </div>
  );
};

export default BalancePage;
