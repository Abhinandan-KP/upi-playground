import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  receiverName: string;
  transactionId: string;
}

export function SuccessAnimation({
  isOpen,
  onClose,
  amount,
  receiverName,
  transactionId,
}: SuccessAnimationProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowDetails(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowDetails(false);
    }
  }, [isOpen]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="text-center px-8">
        {/* Success Circle */}
        <div className="relative mx-auto mb-8">
          {/* Pulse rings */}
          <div className="absolute inset-0 w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full bg-success/20 animate-pulse-ring" />
            <div
              className="absolute inset-0 rounded-full bg-success/20 animate-pulse-ring"
              style={{ animationDelay: '0.5s' }}
            />
          </div>

          {/* Main circle */}
          <div className="relative w-32 h-32 mx-auto rounded-full gradient-success flex items-center justify-center animate-bounce-in">
            <Check className="w-16 h-16 text-success-foreground" strokeWidth={3} />
          </div>
        </div>

        {/* Details */}
        <div
          className={`transition-all duration-500 ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Payment Successful!
          </h2>
          <p className="font-display text-4xl font-bold text-success mb-2">
            {formatAmount(amount)}
          </p>
          <p className="text-muted-foreground mb-6">
            Paid to <span className="font-medium text-foreground">{receiverName}</span>
          </p>

          <div className="bg-muted/50 rounded-2xl p-4 mb-8">
            <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-foreground">{transactionId}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
