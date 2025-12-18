import { useState } from 'react';
import { X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverUPI: string;
  receiverName: string;
  onPay: (amount: number, note: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  receiverUPI,
  receiverName,
  onPay,
}: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const handlePay = () => {
    const numAmount = parseFloat(amount);
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (numAmount > 100000) {
      setError('Maximum transaction limit is ₹1,00,000');
      return;
    }
    onPay(numAmount, note);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center animate-fade-in">
      <div className="w-full max-w-md bg-card rounded-t-3xl shadow-elevated animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card rounded-t-3xl">
          <h2 className="font-display font-semibold text-lg text-foreground">Send Money</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {/* Receiver Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl mb-6">
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">{receiverName}</p>
              <p className="text-sm text-muted-foreground">{receiverUPI}</p>
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
            {error && (
              <p className="text-sm text-destructive mt-2 animate-fade-in">{error}</p>
            )}
          </div>

          {/* Quick Amounts */}
          <div className="flex flex-wrap gap-2 mb-6">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => {
                  setAmount(quickAmount.toString());
                  setError('');
                }}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  amount === quickAmount.toString()
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                )}
              >
                ₹{quickAmount.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Add a note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this for?"
              maxLength={50}
              className="w-full px-4 py-3 rounded-2xl bg-muted/50 border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={!amount || parseFloat(amount) <= 0}
            className={cn(
              'w-full py-4 rounded-2xl font-display font-semibold text-lg transition-all duration-200',
              amount && parseFloat(amount) > 0
                ? 'gradient-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            Pay ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}
          </button>
        </div>
      </div>
    </div>
  );
}
