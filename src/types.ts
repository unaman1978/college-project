export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  role?: string;
  verified: boolean;
  currency: string;
}

export type CategoryType = 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Entertainment' | 'Others';

export interface Transaction {
  id: string;
  description: string;
  category: CategoryType;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "8:30 PM"
  paymentMethod: string; // e.g. "UPI / HDFC", "Paytm UPI", "ICICI CC •• 4091"
  notes?: string;
  merchant?: string;
  receiptNumber?: string;
}

export interface BudgetConfig {
  month: string; // "May 2025"
  targetBudget: number; // 45000
  warningThresholdPercent: number; // 80
  criticalThresholdPercent: number; // 95
  autoSyncEnabled: boolean;
  categoryLimits: Record<CategoryType, number>;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'info' | 'success';
  read: boolean;
}
