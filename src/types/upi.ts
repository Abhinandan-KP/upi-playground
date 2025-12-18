// Base Payment Method class (conceptual inheritance pattern)
export interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'wallet';
  name: string;
}

export interface BankTransfer extends PaymentMethod {
  type: 'bank_transfer';
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

export interface Wallet extends PaymentMethod {
  type: 'wallet';
  walletProvider: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  balance: number; // in ₹
  isPrimary: boolean;
  bankLogo?: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  upiId: string;
  name: string;
  pin: string; // 4-digit PIN (stored as string)
  linkedAccounts: BankAccount[];
  avatar?: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  senderUPI: string;
  senderName: string;
  receiverUPI: string;
  receiverName: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
  type: 'sent' | 'received';
  note?: string;
}

export interface Contact {
  id: string;
  name: string;
  upiId: string;
  phoneNumber: string;
  avatar?: string;
}

export type TransactionFilter = 'all' | 'sent' | 'received';
