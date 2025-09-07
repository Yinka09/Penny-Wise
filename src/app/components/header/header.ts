import {
  Component,
  computed,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { MainService } from '../../services/main/main';
import { take } from 'rxjs/internal/operators/take';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
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
  showDropdown = false;

  dropDownList = [
    {
      title: 'Dashboard',
      action: '/main/dashboard',
      isActive: true,
    },

    {
      title: 'Transactions',
      action: '/main/transactions',
      isActive: false,
    },
    {
      title: 'Budgets',
      action: '/main/budgets',
      isActive: false,
    },

    {
      title: 'Reports',
      action: '/main/reports',
      isActive: false,
    },
    {
      title: 'Profile',
      action: '/main/profile',
      isActive: false,
    },

    {
      title: 'Logout',
      action: '/main/logout',
      isActive: false,
    },
  ];

  constructor(
    private mainService: MainService,
    private router: Router,
    private location: Location,
    private authService: AuthService
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

  isActiveTab(item: string) {
    const currentUrl = this.router.url;
    return currentUrl.includes(item);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  navigateTo(
    item: { title: string; action: string; isActive: boolean },
    event: any
  ) {
    event.stopPropagation();
    this.showDropdown = false;

    if (item.title === 'Logout') {
      this.logOut();
    } else {
      this.router.navigate([item.action]);
    }
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

  logOut() {
    this.mainService.resetNavigationState();
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.showDropdown &&
      this.dropdownContainer &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.showDropdown = false;
    }
  }

  ngOnDestroy(): void {
    this.userInitials = '';
    this.allSubscriptions.unsubscribe();
  }
}
