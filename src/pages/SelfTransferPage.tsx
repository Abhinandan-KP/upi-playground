import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
import { PinEntry } from '@/components/PinEntry';
import { SuccessAnimation } from '@/components/SuccessAnimation';
import { BottomNav } from '@/components/BottomNav';
import { useUPI } from '@/context/UPIContext';
import { BankAccount } from '@/types/upi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SelfTransferPage = () => {
  const navigate = useNavigate();
  const { user, updateBalance, verifyPin } = useUPI();

  const [fromAccount, setFromAccount] = useState<BankAccount | null>(
    user.linkedAccounts.find((acc) => acc.isPrimary) || null
  );
  const [toAccount, setToAccount] = useState<BankAccount | null>(null);
  const [amount, setAmount] = useState('');
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');

  const availableToAccounts = user.linkedAccounts.filter((acc) => acc.id !== fromAccount?.id);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(balance);
  };

  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const handleTransfer = () => {
    const numAmount = parseFloat(amount);

    if (!fromAccount || !toAccount) {
      setError('Please select both accounts');
      return;
    }
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (numAmount > fromAccount.balance) {
      setError('Insufficient balance');
      return;
    }

    setShowPinEntry(true);
  };

  const handlePinSubmit = (pin: string) => {
    if (!verifyPin(pin)) {
      toast.error('Incorrect PIN. Please try again.');
      return;
    }

    if (!fromAccount || !toAccount) return;

    const numAmount = parseFloat(amount);
    const txnId = `TXN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setTransactionId(txnId);

    // Update balances
    updateBalance(fromAccount.id, fromAccount.balance - numAmount);
    updateBalance(toAccount.id, toAccount.balance + numAmount);

    setShowPinEntry(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/');
  };

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
          <h1 className="font-display font-semibold text-lg text-foreground">Self Transfer</h1>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* From Account */}
        <div className="mb-6">
          <label className="text-sm font-medium text-muted-foreground mb-3 block">From Account</label>
          <div className="space-y-2">
            {user.linkedAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => {
                  setFromAccount(account);
                  if (toAccount?.id === account.id) setToAccount(null);
                }}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 border-2',
                  fromAccount?.id === account.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50'
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{account.bankName}</p>
                  <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                </div>
                <p className="font-display font-semibold text-foreground">
                  {formatBalance(account.balance)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-primary-foreground rotate-90" />
          </div>
        </div>

        {/* To Account */}
        <div className="mb-6">
          <label className="text-sm font-medium text-muted-foreground mb-3 block">To Account</label>
          <div className="space-y-2">
            {availableToAccounts.length > 0 ? (
              availableToAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setToAccount(account)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 border-2',
                    toAccount?.id === account.id
                      ? 'border-accent bg-accent/5'
                      : 'border-border bg-card hover:border-accent/50'
                  )}
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{account.bankName}</p>
                    <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                  </div>
                  <p className="font-display font-semibold text-foreground">
                    {formatBalance(account.balance)}
                  </p>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a different source account
              </div>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Enter Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-display font-bold text-foreground">
              ₹
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className={cn(
                'w-full pl-12 pr-4 py-4 text-3xl font-display font-bold rounded-2xl bg-muted/50 border-2 text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors',
                error ? 'border-destructive' : 'border-transparent focus:border-primary'
              )}
            />
          </div>
          {error && <p className="text-sm text-destructive mt-2 animate-fade-in">{error}</p>}
        </div>

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={!fromAccount || !toAccount || !amount || parseFloat(amount) <= 0}
          className={cn(
            'w-full py-4 rounded-2xl font-display font-semibold text-lg transition-all duration-200',
            fromAccount && toAccount && amount && parseFloat(amount) > 0
              ? 'gradient-primary text-primary-foreground hover:opacity-90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          Transfer
        </button>
      </div>

      <PinEntry
        isOpen={showPinEntry}
        onClose={() => setShowPinEntry(false)}
        onSubmit={handlePinSubmit}
        amount={parseFloat(amount) || 0}
        receiverName={toAccount?.bankName || ''}
      />

      <SuccessAnimation
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        amount={parseFloat(amount) || 0}
        receiverName={toAccount?.bankName || ''}
        transactionId={transactionId}
      />

      <BottomNav />
    </div>
  );
};

export default SelfTransferPage;
