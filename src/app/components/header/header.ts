import { Component, computed, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../../services/main/main';
import { take } from 'rxjs/internal/operators/take';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';

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

  showBackArrow = false;

  constructor(
    private mainService: MainService,
    private router: Router,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    const savedInitials = localStorage.getItem('userInitials') || '';
    this.userInitials = this.getUserInitialsArray(savedInitials);

    const sub = this.mainService
      .getIsTransactionPage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isNotTransactionPage = data;
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const currentUrl = event.urlAfterRedirects;

        if (currentUrl === '/dashboard') {
          if (this.mainService.firstDashboardVisit) {
            this.showBackArrow = false;
            this.mainService.firstDashboardVisit = false;
          } else {
            this.showBackArrow = true;
          }
        } else {
          this.showBackArrow = true;
        }
      });
  }

  toggleSidebar() {
    const subscribe1 = this.mainService.getViewSidebar().subscribe((val) => {
      this.isViewSidebar = val;
      // console.log('isViewSidebar:', this.isViewSidebar);
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

  currentUrlIsTransaction() {
    return this.currentUrl === '/main/transactions';
  }

  navigateToTransactions() {
    this.router.navigate(['/main/transactions']);
  }

  navigateToPrev() {
    this.location.back();
  }
  ngOnDestroy(): void {
    this.userInitials = '';
    this.allSubscriptions.unsubscribe();
  }
}
