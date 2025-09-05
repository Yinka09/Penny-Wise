import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor() {}
  private viewSidebarSubject = new BehaviorSubject<boolean>(true);
  viewSidebar$ = this.viewSidebarSubject.asObservable();
  private viewSmallScreenSidebarSubject = new BehaviorSubject<boolean>(false);
  viewSmallScreenSidebar$ = this.viewSmallScreenSidebarSubject.asObservable();


  headerTitle = signal<string>('Dashboard');
  private isTransactionPageSubject = new BehaviorSubject<boolean>(false);
  isTransactionPage$ = this.isTransactionPageSubject.asObservable();

  firstDashboardVisit = true;

  getViewSidebar() {
    return this.viewSidebar$;
  }
  getViewSmallScreenSidebar() {
    return this.viewSmallScreenSidebar$;
  }
  setViewSidebar(value: boolean) {
    this.viewSidebarSubject.next(value);
  }
  setViewSmallScreenSidebar(value: boolean) {
    this.viewSmallScreenSidebarSubject.next(value);
  }

  // getHeaderTitle(): Observable<string> {
  //   return this.headerTitle$;
  // }

  // setHeaderTitle(title: string) {
  //   this.headerTitleSubject.next(title);
  // }
  getIsTransactionPage(): Observable<boolean> {
    return this.isTransactionPage$;
  }

  setIsTransactionPage(transactionPage: boolean) {
    this.isTransactionPageSubject.next(transactionPage);
  }

  resetNavigationState() {
    this.firstDashboardVisit = true;
  }
}
