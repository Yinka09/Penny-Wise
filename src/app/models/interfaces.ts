export interface ICustomers {
  id: number;
  customerName: string;
  phoneNumber: string;
  accountNumber: string;
  email: string;
  customerId: string;
  status: string;
  lastActive: string;
  dateRegistered: string;
  isStaff: string;
}

export interface ISidebarItems {
  title: string;
  action: string;
  isActive: boolean;
  icon: string;
  children?: ISidebarItems[];
}

export interface ITransactions {
  transactionId: string;
  accountNumber: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  description: string;
}

export interface IDashboardCardData {
  title: string;
  value: number;
  icon: string;
  iconBg: string;
  percentage: number;
}

export interface IDashboardTableData {
  accountNumber: string;
  customerId: string;
  dateRegistered: string;
  status: string;
}

export interface ICardData {
  title: string;
  amount: number | null;
  description: string;
  icon: string;
  iconBg: string;
  percentage: number;
}

export interface ICustomers {
  id: number;
  customerName: string;
  phoneNumber: string;
  accountNumber: string;
  email: string;
  customerId: string;
  status: string;
  lastActive: string;
  dateRegistered: string;
  isStaff: string;
}

export interface IDashboardTableData {
  accountNumber: string;
  customerId: string;
  dateRegistered: string;
  status: string;
}

export interface IChartData {
  expense: string;
  amount: number;
}

export interface ITransactions {
  transactionId: string;
  accountNumber: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  description: string;
}

export interface ITransactionsTableData {
  transactionId: string;
  date: Date;
  description: string;
  paymentMethod: string;
  category: string;
  amount: number;
  type: 'Expense' | 'Income';
}

export interface ITransactionCategory {
  name: string;
  code: string;
}

export interface IProgressData {
  percent: number;
  radius: number;
  outerStrokeWidth: number;
  innerStrokeWidth: number;
  outerStrokeColor: string;
  innerStrokeColor: string;
  animation: boolean;
  animationDuration: number;
}

export interface IBudgetsCategory {
  id: number;
  budgetCategory: string;
  amountBudgeted: number;
  amountSpent: number;
  icon: string;
  iconColor: string;
  iconBg: string;
}

export interface ISavingsCategory {
  id: number;
  name: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

export interface ISavings {
  id: number;
  title: string;
  description: string;
  savingCategoryId: number;
  amountSaved: number;
  targetAmount: number;
  status: string;
  date: Date;
}

export interface ISavingsTableData {
  id: number;
  savingsId: number;
  savingCategoryId: number;
  withdrawal?: 'Withdrawal';
  amount: number;
  date: Date;
  description: string;
  type: 'Deposit' | 'Withdrawal';
}
