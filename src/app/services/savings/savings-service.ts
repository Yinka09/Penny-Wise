import { computed, Injectable, signal } from '@angular/core';
import {
  MockSavingsCategory,
  MockSavingsData,
  MockSavingsTableData,
} from '../../models/mock-data';
import {
  ISavingsCategory,
  ISavings,
  ISavingsTableData,
} from '../../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  // public totalSavingsBalance = signal<number>(
  //   this.fetchTotalSavingsFromStorage()
  // );

  public totalSavingsBalance = computed(
    () => this.calculateTotalDeposits() - this.calculateTotalWithdrawals()
  );

  // readonly totalSavingsBalanceReadonly = this.totalSavingsBalance.asReadonly();

  savingsTableData = signal<ISavingsTableData[]>(
    this.fetchSavingsTableFromStorageData()
  );

  readonly savingsTableDataReadOnly = this.savingsTableData.asReadonly();

  allSavingsCategories = signal<ISavingsCategory[]>(
    this.fetchAllSavingsCategories()
  );

  allSavingsData = signal<ISavings[]>(this.fetchAllSavingsData());

  calculateTotalDeposits = computed(() => {
    // console.log('Total Deposits:', this.allSavingsCategories());
    const totalDeposits = this.savingsTableDataReadOnly()
      .filter((item) => item.type === 'Deposit')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return totalDeposits;
  });

  calculateTotalWithdrawals = computed(() => {
    const totalWithdrawals = this.savingsTableData()
      .filter((item) => item.type === 'Withdrawal')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return totalWithdrawals;
  });
  constructor() {}

  // calculateTotalDeposits() {
  //   console.log('Total Deposits:', this.allSavingsCategories());
  //   const totalDeposits = this.savingsTableDataReadOnly()
  //     .filter((item) => item.type === 'Deposit')
  //     .reduce((acc, curr) => acc + curr.amount, 0);

  //   return totalDeposits;

  // }
  // calculateTotalWithdrawals() {
  //   const totalWithdrawals = this.savingsTableData()
  //     .filter((item) => item.type === 'Withdrawal')
  //     .reduce((acc, curr) => acc + curr.amount, 0);

  //   return totalWithdrawals;
  // }

  fetchTotalSavingsFromStorage() {
    const data = sessionStorage.getItem('totalSavings');
    // const totalDeposites = this.calculateTotalDeposits();
    // const totalWithdrawals = this.calculateTotalWithdrawals();
    if (data) {
      return JSON.parse(data);
    } else {
      return this.calculateTotalDeposits() - this.calculateTotalWithdrawals();
    }
  }

  fetchSavingsTableFromStorageData() {
    const data = sessionStorage.getItem('savingsTableData');
    if (data) {
      return JSON.parse(data);
    } else {
      return MockSavingsTableData;
    }
  }

  fetchAllSavingsCategories() {
    const data = sessionStorage.getItem('allSavingsCategories');
    if (data) {
      return JSON.parse(data);
    } else {
      return MockSavingsCategory;
    }
  }

  fetchAllSavingsData() {
    const data = sessionStorage.getItem('allSavingsData');
    if (data) {
      return JSON.parse(data);
    } else {
      return MockSavingsData;
    }
  }

  addToSavingsTable(item: ISavingsTableData) {
    // const currentData = this.savingsTableData();
    // const updatedData = [item, ...currentData];
    // this.savingsTableData.set(updatedData);
    // sessionStorage.setItem('savingsTableData', JSON.stringify(updatedData));
    // const newTotal = item.type === 'Deposit' ? this.totalSavingsBalance() + item.amount : this.totalSavingsBalance() - item.amount;
    // this.totalSavingsBalance.set(newTotal);
    // sessionStorage.setItem('totalSavings', JSON.stringify(newTotal));
    this.savingsTableData.update((prevData) => {
      const updated = [item, ...prevData];
      sessionStorage.setItem('savingsTableData', JSON.stringify(updated));
      // const newTotalSavingsBalance =
      //   item.type === 'Deposit'
      //     ? this.totalSavingsBalance() + item.amount
      //     : this.totalSavingsBalance() - item.amount;
      // this.totalSavingsBalance.update((prevBal) => {
      //   const newTotal =
      //     item.type === 'Deposit'
      //       ? prevBal + item.amount
      //       : prevBal - item.amount;
      //   sessionStorage.setItem('totalSavings', JSON.stringify(newTotal));
      //   return newTotal;
      // });
      sessionStorage.setItem(
        'totalSavings',
        JSON.stringify(this.totalSavingsBalance())
      );

      return updated;
    });

    this.calculateAmountSavedForGoal(item);
  }

  updateSavingsTableItem(id: number | undefined, item: ISavingsTableData) {
    this.savingsTableData.update((prevData) => {
      const updated = prevData.map((el) =>
        el.id === id ? { ...el, ...item } : el
      );
      sessionStorage.setItem('savingsTableData', JSON.stringify(updated));
      return updated;
    });

    this.calculateAmountSavedForGoal(item);
  }

  updateHistoryType(
    item: ISavingsTableData,
    newType: 'Deposit' | 'Withdrawal'
  ) {
    this.savingsTableData.update((prevData) => {
      const updated = prevData.map((el) =>
        el.id === item.id ? { ...el, type: newType } : el
      );
      sessionStorage.setItem('savingsTableData', JSON.stringify(updated));
      this.calculateAmountSavedForGoal(item);
      return updated;
    });
  }
  deleteSavingsTableItem(item: ISavingsTableData) {
    this.savingsTableData.update((prevData) => {
      const itemToDelete = prevData.find((el) => el.id === item.id);
      const updated = prevData.filter((el) => el.id !== item.id);
      sessionStorage.setItem('savingsTableData', JSON.stringify(updated));

      // this.totalSavingsBalance.update((prevBal) =>
      //   itemToDelete
      //     ? itemToDelete.type === 'Deposit'
      //       ? prevBal - itemToDelete.amount
      //       : prevBal + itemToDelete.amount
      //     : prevBal
      // );
      sessionStorage.setItem(
        'totalSavings',
        JSON.stringify(this.totalSavingsBalance())
      );
      return updated;
    });

    this.calculateAmountSavedForGoal(item);
  }

  resetSavingsTable() {
    this.savingsTableData.set([]);
    sessionStorage.setItem('savingsTableData', JSON.stringify([]));
    // this.totalSavingsBalance.set(0);
    sessionStorage.setItem('totalSavings', JSON.stringify(0));
  }

  getAllSavingsWithSavedAmount() {
    return this.allSavingsData().map((goal) => {
      const totalForGoal = this.savingsTableData()
        .filter((txn) => txn.savingsId === goal.id)
        .reduce(
          (acc, txn) =>
            acc + (txn.type === 'Deposit' ? txn.amount : -txn.amount),
          0
        );

      return { ...goal, amountSaved: totalForGoal };
    });
  }

  // getAllSavingsWithSavedAmount() {
  //   const allSavings = this.allSavingsData();
  //   const allSavingsTableData = this.savingsTableData();
  //   for (let goal of allSavings) {
  //     for (let txn of allSavingsTableData) {
  //       if (goal.id === txn.savingsId) {
  //         goal.amountSaved += txn.type === 'Deposit' ? txn.amount : -txn.amount;
  //       }
  //     }
  //   }

  //   return allSavings;
  // }
  addToSavings(item: ISavings) {
    this.allSavingsData.update((prevData) => {
      const updated = [item, ...prevData];
      sessionStorage.setItem('allSavingsData', JSON.stringify(updated));
      return updated;
    });
  }

  updateSavingsItem(item: ISavings, updatedAmount: number) {
    this.allSavingsData.update((prevData) => {
      const updated = prevData.map((el) =>
        el.id === item.id ? { ...el, ...item, amountSaved: updatedAmount } : el
      );
      sessionStorage.setItem('allSavingsData', JSON.stringify(updated));
      return updated;
    });

    this.savingsTableData.update((prevData) => {
      const updated = prevData.filter((el) => el.savingsId !== item.id);
      sessionStorage.setItem('savingsTableData', JSON.stringify(updated));
      return updated;
    });
  }

  deleteSavingsItem(item: ISavings) {
    this.allSavingsData.update((prevData) => {
      const updated = prevData.filter((el) => el.id !== item.id);
      sessionStorage.setItem('allSavingsData', JSON.stringify(updated));
      return updated;
    });
  }

  resetAllSavings() {
    this.allSavingsData.set([]);
    sessionStorage.setItem('allSavingsData', JSON.stringify([]));
    this.resetSavingsTable();
  }

  calculateAmountSavedForGoal(item: ISavingsTableData) {
    const relatedSavingsGoal = this.allSavingsData().find(
      (el) => el.id === item.savingsId
    );
    if (relatedSavingsGoal) {
      // if (item.type === 'Deposit') {
      //   this.allSavingsData.update((prevData) => {
      //     const updated = prevData.map((el) =>
      //       el.id === relatedSavingsGoal.id
      //         ? { ...el, amountSaved: el.amountSaved + item.amount }
      //         : el
      //     );
      //     sessionStorage.setItem('allSavingsData', JSON.stringify(updated));
      //     return updated;
      //   });
      // }

      this.allSavingsData.update((prevData) => {
        const updated = prevData.map((el) => {
          if (el.id === relatedSavingsGoal.id && item.type === 'Deposit') {
            return { ...el, amountSaved: el.amountSaved + item.amount };
          } else if (
            el.id === relatedSavingsGoal.id &&
            item.type === 'Withdrawal'
          ) {
            return { ...el, amountSaved: el.amountSaved - item.amount };
          } else {
            return el;
          }
        });
        sessionStorage.setItem('allSavingsData', JSON.stringify(updated));
        // this.totalSavingsBalance.update((prevBal) =>
        //   relatedSavingsGoal
        //     ? prevBal + (item.type === 'Deposit' ? item.amount : -item.amount)
        //     : prevBal
        // );
        sessionStorage.setItem(
          'totalSavings',
          JSON.stringify(this.totalSavingsBalance())
        );
        return updated;
      });
    }
  }

  getSavingsGoalById(id: number) {
    return this.allSavingsData().find((el) => el.id === id);
  }

  getSavingsCategoryById(id: number) {
    return this.allSavingsCategories().find((el) => el.id === id);
  }

  getSavingsCategoryName(id: number) {
    const category = this.allSavingsCategories().find((el) => el.id === id);
    return category ? category.name : 'Unknown';
  }

  getSavingsGoalTitle(id: number) {
    const goal = this.allSavingsData().find((el) => el.id === id);
    return goal ? goal.title : 'Unknown';
  }
}
