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
  amount: number;
  description: string;
  icon: string;
  iconBg: string;
  percentage: number;
}

// export interface ITransactionsTableData {
//   customerId: string;
//   transactionDate: string;
//   transactionType: string;
//   amount: number;
//   currency: string;
//   paymentRef: string;
//   channel: string;
//   status: string;
// }

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
  category: string;
  amount: number;
  type: 'Expense' | 'Income';
}
