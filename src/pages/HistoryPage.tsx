import { useState } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TransactionCard } from '@/components/TransactionCard';
import { BottomNav } from '@/components/BottomNav';
import { useUPI } from '@/context/UPIContext';
import { TransactionFilter } from '@/types/upi';
import { cn } from '@/lib/utils';

const filters: { label: string; value: TransactionFilter }[] = [
  
  { label: 'All', value: 'all' },
  { label: 'Sent', value: 'sent' },
  { label: 'Received', value: 'received' },
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const { transactions } = useUPI();
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>('all');

  const filteredTransactions = transactions.filter((txn) => {
    if (activeFilter === 'all') return true;
    return txn.type === activeFilter;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, txn) => {
    const date = txn.timestamp.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(txn);
    return groups;
  }, {} as Record<string, typeof transactions>);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display font-semibold text-lg text-foreground">
              Transaction History
            </h1>
          </div>
          <Filter className="w-5 h-5 text-muted-foreground" />
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 py-4">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                activeFilter === filter.value
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-muted'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([date, txns]) => (
            <div key={date} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
              <div className="space-y-3">
                {txns.map((txn, index) => (
                  <div
                    key={txn.id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TransactionCard transaction={txn} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default HistoryPage;
