import { Injectable, signal } from '@angular/core';
import { ITransactionsTableData } from '../../models/interfaces';
import { TransactionsMockTableData } from '../../models/mock-data';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private transactionsData = signal<ITransactionsTableData[]>(
    this.fetchTransactionsFromStorageData()
  );

  allTransactions = this.transactionsData.asReadonly();

  constructor() {}

  addTransaction(transaction: ITransactionsTableData) {
    // this.transactionsData.update((prevTrans) => {
    //   return [transaction, ...prevTrans];
    // });
    this.transactionsData.update((prevTrans) => {
      const updated = [transaction, ...prevTrans];
      sessionStorage.setItem('transactionsData', JSON.stringify(updated));
      return updated;
    });
  }

  updateTransaction(transactionId: string | undefined, updateVal: any) {
    this.transactionsData.update((prevTrans: ITransactionsTableData[]) => {
      const updated = prevTrans.map((el) =>
        el.transactionId === transactionId ? { ...el, ...updateVal } : el
      );
      sessionStorage.setItem('transactionsData', JSON.stringify(updated));
      return updated;
    });
  }

  deleteTransaction(id: string) {
    this.transactionsData.update((prevTrans: ITransactionsTableData[]) => {
      const updated = prevTrans.filter(
        (el: ITransactionsTableData) => el.transactionId !== id
      );
      sessionStorage.setItem('transactionsData', JSON.stringify(updated));
      return updated;
    });
  }

  updateTransactionType(
    transaction: ITransactionsTableData,
    newType: 'Income' | 'Expense'
  ) {
    this.transactionsData.update((prevTrans) => {
      const updated: ITransactionsTableData[] = prevTrans.map((el) =>
        el.transactionId === transaction.transactionId
          ? { ...el, type: newType }
          : el
      );

      sessionStorage.setItem('transactionsData', JSON.stringify(updated));
      return updated;
    });
  }

  resetTransactions() {
    const updated = this.transactionsData.set([]);
    sessionStorage.setItem('transactionsData', JSON.stringify(updated));
  }

  fetchTransactionsFromStorageData() {
    const data = sessionStorage.getItem('transactionsData');
    if (data) {
      return JSON.parse(data);
    } else {
      return TransactionsMockTableData;
    }
  }
}
