import { useState, useRef, useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PinEntryProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
  
  amount?: number;
  receiverName?: string;
}

export function PinEntry({ isOpen, onClose, onSubmit, amount, receiverName }: PinEntryProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError(false);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 3 && value) {
      const fullPin = newPin.join('');
      if (fullPin.length === 4) {
        onSubmit(fullPin);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center animate-fade-in">
      <div className="w-full max-w-md bg-card rounded-t-3xl shadow-elevated animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">Enter UPI PIN</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          {amount && receiverName && (
            <div className="text-center mb-6">
              <p className="text-muted-foreground">Paying</p>
              <p className="font-display text-2xl font-bold text-foreground mt-1">
                {formatAmount(amount)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">to {receiverName}</p>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'pin-input',
                  error && 'border-destructive animate-shake'
                )}
              />
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Enter your 4-digit UPI PIN to authorize this payment
          </p>
        </div>
      </div>
    </div>
  );
}
