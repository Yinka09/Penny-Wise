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
