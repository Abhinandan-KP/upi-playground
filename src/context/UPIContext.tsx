import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, BankAccount, Transaction, Contact } from '@/types/upi';

interface UPIContextType {
  user: User;
  transactions: Transaction[];
  contacts: Contact[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateBalance: (accountId: string, newBalance: number) => void;
  
  verifyPin: (pin: string) => boolean;
  getAccountBalance: (accountId: string) => number;
  getPrimaryAccount: () => BankAccount | undefined;
}

const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${random}`;
};

// Mock data
const mockUser: User = {
  id: '1',
  phoneNumber: '9876543210',
  upiId: 'rahul@bharatpay',
  name: 'Rahul Sharma',
  pin: '1234',
  linkedAccounts: [
    {
      id: 'acc1',
      bankName: 'State Bank of India',
      accountNumber: 'XXXX XXXX 4521',
      ifsc: 'SBIN0001234',
      balance: 45750.50,
      isPrimary: true,
    },
    {
      id: 'acc2',
      bankName: 'HDFC Bank',
      accountNumber: 'XXXX XXXX 7832',
      ifsc: 'HDFC0001234',
      balance: 23400.00,
      isPrimary: false,
    },
    {
      id: 'acc3',
      bankName: 'ICICI Bank',
      accountNumber: 'XXXX XXXX 9156',
      ifsc: 'ICIC0001234',
      balance: 12850.75,
      isPrimary: false,
    },
  ],
};

const mockContacts: Contact[] = [
  { id: '1', name: 'Priya Singh', upiId: 'priya@upi', phoneNumber: '9876543211' },
  { id: '2', name: 'Amit Kumar', upiId: 'amit.kumar@upi', phoneNumber: '9876543212' },
  { id: '3', name: 'Neha Patel', upiId: 'neha.p@upi', phoneNumber: '9876543213' },
  { id: '4', name: 'Vikram Reddy', upiId: 'vikram.r@upi', phoneNumber: '9876543214' },
  { id: '5', name: 'Anjali Gupta', upiId: 'anjali@upi', phoneNumber: '9876543215' },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    transactionId: 'TXN2024A1B2C3',
    senderUPI: 'rahul@bharatpay',
    senderName: 'Rahul Sharma',
    receiverUPI: 'priya@upi',
    receiverName: 'Priya Singh',
    amount: 2500,
    status: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'sent',
    note: 'Dinner bill split',
  },
  {
    id: '2',
    transactionId: 'TXN2024D4E5F6',
    senderUPI: 'amit.kumar@upi',
    senderName: 'Amit Kumar',
    receiverUPI: 'rahul@bharatpay',
    receiverName: 'Rahul Sharma',
    amount: 5000,
    status: 'success',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: 'received',
    note: 'Rent share',
  },
  {
    id: '3',
    transactionId: 'TXN2024G7H8I9',
    senderUPI: 'rahul@bharatpay',
    senderName: 'Rahul Sharma',
    receiverUPI: 'neha.p@upi',
    receiverName: 'Neha Patel',
    amount: 1200,
    status: 'success',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    type: 'sent',
    note: 'Movie tickets',
  },
  {
    id: '4',
    transactionId: 'TXN2024J1K2L3',
    senderUPI: 'vikram.r@upi',
    senderName: 'Vikram Reddy',
    receiverUPI: 'rahul@bharatpay',
    receiverName: 'Rahul Sharma',
    amount: 750,
    status: 'success',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    type: 'received',
  },
];

const UPIContext = createContext<UPIContextType | undefined>(undefined);

export function UPIProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [contacts] = useState<Contact[]>(mockContacts);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: (transactions.length + 1).toString(),
      transactionId: generateTransactionId(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateBalance = (accountId: string, newBalance: number) => {
    setUser((prev) => ({
      ...prev,
      linkedAccounts: prev.linkedAccounts.map((acc) =>
        acc.id === accountId ? { ...acc, balance: newBalance } : acc
      ),
    }));
  };

  const verifyPin = (pin: string): boolean => {
    return user.pin === pin;
  };

  const getAccountBalance = (accountId: string): number => {
    const account = user.linkedAccounts.find((acc) => acc.id === accountId);
    return account?.balance ?? 0;
  };

  const getPrimaryAccount = (): BankAccount | undefined => {
    return user.linkedAccounts.find((acc) => acc.isPrimary);
  };

  return (
    <UPIContext.Provider
      value={{
        user,
        transactions,
        contacts,
        addTransaction,
        updateBalance,
        verifyPin,
        getAccountBalance,
        getPrimaryAccount,
      }}
    >
      {children}
    </UPIContext.Provider>
  );
}

export function useUPI() {
  const context = useContext(UPIContext);
  if (context === undefined) {
    throw new Error('useUPI must be used within a UPIProvider');
  }
  return context;
}
