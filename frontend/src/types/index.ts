export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
  type: 'expense' | 'income';
  userId: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  userId: string;
}

export interface DashboardSummary {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  recentTransactions: Transaction[];
  expensesByCategory: {
    categoryId: string;
    amount: number;
    percentage: number;
  }[];
  monthlyTrend: {
    month: string;
    expenses: number;
    income: number;
  }[];
}