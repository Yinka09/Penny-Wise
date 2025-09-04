import { Injectable, signal } from '@angular/core';
import { ITransactionsTableData } from '../../models/interfaces';
import { TransactionsMockTableData } from '../../models/mock-data';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private transactionsData = signal<ITransactionsTableData[]>(
    TransactionsMockTableData
  );

  allTransactions = this.transactionsData.asReadonly();

  constructor() {}

  addTransaction(transaction: ITransactionsTableData) {
    this.transactionsData.update((prevTrans) => {
      return [transaction, ...prevTrans];
    });
  }

  updateTransaction(transactionId: string | undefined, updateVal: any) {
    this.transactionsData.update((prevTrans: ITransactionsTableData[]) => {
      return prevTrans.map((el) =>
        el.transactionId === transactionId ? { ...el, ...updateVal } : el
      );
    });
  }

  deleteTransaction(id: string) {
    this.transactionsData.update((prevTrans: ITransactionsTableData[]) =>
      prevTrans.filter((el: ITransactionsTableData) => el.transactionId !== id)
    );
  }

  addTransactionToIncome(transaction: ITransactionsTableData) {
    this.transactionsData.update((prevTrans) => {
      return prevTrans.map((el) =>
        el.transactionId === transaction.transactionId
          ? { ...el, type: 'Income' }
          : el
      );
    });
  }
  addTransactionToExpense(transaction: ITransactionsTableData) {
    this.transactionsData.update((prevTrans) => {
      return prevTrans.map((el) =>
        el.transactionId === transaction.transactionId
          ? { ...el, type: 'Expense' }
          : el
      );
    });
  }

  resetTransactions() {
    this.transactionsData.set([]);
  }
}
