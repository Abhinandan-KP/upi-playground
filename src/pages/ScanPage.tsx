import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { QRScanner } from '@/components/QRScanner';
import { PaymentModal } from '@/components/PaymentModal';
import { PinEntry } from '@/components/PinEntry';
import { SuccessAnimation } from '@/components/SuccessAnimation';
import { BottomNav } from '@/components/BottomNav';
import { useUPI } from '@/context/UPIContext';
import { toast } from 'sonner';

const ScanPage = () => {
  const navigate = useNavigate();
  const { user, addTransaction, updateBalance, verifyPin, getPrimaryAccount } = useUPI();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannedUPI, setScannedUPI] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentNote, setPaymentNote] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const getNameFromUPI = (upiId: string) => {
    const username = upiId.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1).replace(/[._]/g, ' ');
  };

  const handleScan = (upiId: string) => {
    if (upiId === user.upiId) {
      toast.error('Cannot pay to yourself');
      return;
    }
    setScannedUPI(upiId);
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

    const primaryAccount = getPrimaryAccount();
    if (!primaryAccount) return;

    // Generate transaction ID
    const txnId = `TXN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setTransactionId(txnId);

    // Update balance
    updateBalance(primaryAccount.id, primaryAccount.balance - paymentAmount);

    // Add transaction
    addTransaction({
      transactionId: txnId,
      senderUPI: user.upiId,
      senderName: user.name,
      receiverUPI: scannedUPI,
      receiverName: getNameFromUPI(scannedUPI),
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
    setScannedUPI('');
    setPaymentAmount(0);
    setPaymentNote('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-md mx-auto flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display font-semibold text-lg text-foreground">Scan & Pay</h1>
        </div>
      </header>

      <QRScanner isOpen={true} onClose={() => navigate('/')} onScan={handleScan} />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        receiverUPI={scannedUPI}
        receiverName={getNameFromUPI(scannedUPI)}
        onPay={handlePay}
      />

      <PinEntry
        isOpen={showPinEntry}
        onClose={() => setShowPinEntry(false)}
        onSubmit={handlePinSubmit}
        amount={paymentAmount}
        receiverName={getNameFromUPI(scannedUPI)}
      />

      <SuccessAnimation
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        amount={paymentAmount}
        receiverName={getNameFromUPI(scannedUPI)}
        transactionId={transactionId}
      />

      <BottomNav />
    </div>
  );
};

export default ScanPage;
