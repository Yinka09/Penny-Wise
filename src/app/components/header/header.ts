import { Component, computed, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../../services/main/main';
import { take } from 'rxjs/internal/operators/take';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  userInitials: string = '';
  // title: string = '';
  title = computed(() => {
    return this.mainService.headerTitle();
  });
  isViewSidebar!: boolean;
  currentUrl = '';
  isNotTransactionPage: boolean = false;

  allSubscriptions = new Subscription();
  private destroy$ = new Subject<void>();

  // viewSidebar$ = this.mainService.getViewSidebar();
  constructor(private mainService: MainService, private router: Router) {}
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    const savedInitials = sessionStorage.getItem('userInitials') || '';
    this.userInitials = this.getUserInitialsArray(savedInitials);

    // this.mainService.headerTitle$.pipe(take(1)).subscribe((title: string) => {
    //   this.title = title;
    // });

    const sub = this.mainService
      .getIsTransactionPage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isNotTransactionPage = data;
      });
  }

  toggleSidebar() {
    const subscribe1 = this.mainService.getViewSidebar().subscribe((val) => {
      this.isViewSidebar = val;
      console.log('isViewSidebar:', this.isViewSidebar);
    });
    this.mainService.setViewSidebar(!this.isViewSidebar);
    this.mainService.setViewSmallScreenSidebar(!this.isViewSidebar);

    this.allSubscriptions.add(subscribe1);
  }

  getUserInitialsArray(name: string) {
    const nameArr = name.split('');
    let initials = nameArr[0].toUpperCase() + nameArr[1].toUpperCase();
    return initials;
  }

  ngOnDestroy(): void {
    this.userInitials = '';
    this.allSubscriptions.unsubscribe();
  }

  currentUrlIsTransaction() {
    return this.currentUrl === '/main/transactions';
  }
}
