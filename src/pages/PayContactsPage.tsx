import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User } from 'lucide-react';
import { PaymentModal } from '@/components/PaymentModal';
import { PinEntry } from '@/components/PinEntry';
import { SuccessAnimation } from '@/components/SuccessAnimation';
import { BottomNav } from '@/components/BottomNav';
import { useUPI } from '@/context/UPIContext';
import { Contact } from '@/types/upi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PayContactsPage = () => {
  const navigate = useNavigate();
  
  const { user, contacts, addTransaction, updateBalance, verifyPin, getPrimaryAccount } = useUPI();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentNote, setPaymentNote] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowPaymentModal(true);
  };

  const handlePay = (amount: number, note: string) => {
    const primaryAccount = getPrimaryAccount();
    if (!primaryAccount) {
      toast.error('No bank account linked');
      return;
    }
    if (amount > primaryAccount.balance) {
      toast.error('Insufficient balance');
      return;
    }
    setPaymentAmount(amount);
    setPaymentNote(note);
    setShowPaymentModal(false);
    setShowPinEntry(true);
  };

  const handlePinSubmit = (pin: string) => {
    if (!verifyPin(pin)) {
      toast.error('Incorrect PIN. Please try again.');
      return;
    }

    if (!selectedContact) return;

    const primaryAccount = getPrimaryAccount();
    if (!primaryAccount) return;

    const txnId = `TXN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setTransactionId(txnId);

    updateBalance(primaryAccount.id, primaryAccount.balance - paymentAmount);

    addTransaction({
      transactionId: txnId,
      senderUPI: user.upiId,
      senderName: user.name,
      receiverUPI: selectedContact.upiId,
      receiverName: selectedContact.name,
      amount: paymentAmount,
      status: 'success',
      timestamp: new Date(),
      type: 'sent',
      note: paymentNote || undefined,
    });

    setShowPinEntry(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSelectedContact(null);
    setPaymentAmount(0);
    setPaymentNote('');
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
          <h1 className="font-display font-semibold text-lg text-foreground">Pay Contacts</h1>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or UPI ID"
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="px-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">All Contacts</h2>
        <div className="space-y-2">
          {filteredContacts.map((contact, index) => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className={cn(
                'w-full flex items-center gap-4 p-4 bg-card rounded-2xl transition-all duration-200 hover:shadow-card animate-fade-in',
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.upiId}</p>
              </div>
            </button>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No contacts found</p>
          </div>
        )}
      </div>

      {selectedContact && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          receiverUPI={selectedContact.upiId}
          receiverName={selectedContact.name}
          onPay={handlePay}
        />
      )}

      <PinEntry
        isOpen={showPinEntry}
        onClose={() => setShowPinEntry(false)}
        onSubmit={handlePinSubmit}
        amount={paymentAmount}
        receiverName={selectedContact?.name || ''}
      />

      <SuccessAnimation
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        amount={paymentAmount}
        receiverName={selectedContact?.name || ''}
        transactionId={transactionId}
      />

      <BottomNav />
    </div>
  );
};

export default PayContactsPage;
