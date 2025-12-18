import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '@/types/upi';
import { cn } from '@/lib/utils';

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const isSent = transaction.type === 'sent';
  const displayName = isSent ? transaction.receiverName : transaction.senderName;
  const displayUPI = isSent ? transaction.receiverUPI : transaction.senderUPI;
  

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="transaction-card animate-fade-in">
      <div
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
          isSent ? 'bg-destructive/10' : 'bg-success/10'
        )}
      >
        {isSent ? (
          <ArrowUpRight className="w-6 h-6 text-destructive" />
        ) : (
          <ArrowDownLeft className="w-6 h-6 text-success" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{displayName}</p>
        <p className="text-sm text-muted-foreground truncate">{displayUPI}</p>
        {transaction.note && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {transaction.note}
          </p>
        )}
      </div>

      <div className="text-right shrink-0">
        <p
          className={cn(
            'font-display font-semibold',
            isSent ? 'text-destructive' : 'text-success'
          )}
        >
          {isSent ? '-' : '+'}{formatAmount(transaction.amount)}
        </p>
        <p className="text-xs text-muted-foreground">{formatTime(transaction.timestamp)}</p>
      </div>
    </div>
  );
}
