import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useUPI } from '@/context/UPIContext';
import { TransactionCard } from './TransactionCard';

export function RecentTransactions() {
  const { transactions } = useUPI();
  const navigate = useNavigate();

  const recentTransactions = transactions.slice(0, 4);

  return (
    <section className="px-4 pb-24">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg text-foreground">Recent Transactions</h2>
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {recentTransactions.length > 0 ? (
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TransactionCard transaction={transaction} />
            </div>
          ))}
        </div>
      ) : (
        <div className="card-elevated p-8 text-center">
          <p className="text-muted-foreground">No transactions yet</p>
        </div>
      )}
    </section>
  );
}
