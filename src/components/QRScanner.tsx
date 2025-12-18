import { useState } from 'react';
import { X, QrCode, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (upiId: string) => void;
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!upiId.trim()) {
      setError('Please enter a UPI ID');
      
      return;
    }
    if (!upiId.includes('@')) {
      setError('Invalid UPI ID format (e.g., user@upi)');
      return;
    }
    onScan(upiId.trim());
    setUpiId('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-display font-semibold text-lg text-foreground">Scan QR Code</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Scanner Area Simulation */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative w-64 h-64 mb-8">
          {/* Scanner frame */}
          <div className="absolute inset-0 border-2 border-primary/30 rounded-3xl" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-3xl" />

          {/* Scanning line animation */}
          <div className="absolute inset-4 overflow-hidden rounded-2xl">
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-[scan_2s_ease-in-out_infinite]" />
          </div>

          {/* QR Icon placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCode className="w-24 h-24 text-muted-foreground/20" />
          </div>
        </div>

        <p className="text-muted-foreground text-center mb-8">
          Point your camera at a QR code, or enter UPI ID manually below
        </p>

        {/* Manual Entry */}
        <div className="w-full max-w-sm">
          <div className="relative">
            <input
              type="text"
              value={upiId}
              onChange={(e) => {
                setUpiId(e.target.value);
                setError('');
              }}
              placeholder="Enter UPI ID (e.g., user@upi)"
              className={cn(
                'w-full px-4 py-4 pr-14 rounded-2xl bg-card border-2 text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors',
                error ? 'border-destructive' : 'border-border focus:border-primary'
              )}
            />
            <button
              onClick={handleSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl gradient-primary flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <ArrowRight className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
          {error && (
            <p className="text-sm text-destructive mt-2 animate-fade-in">{error}</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
