import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MainService } from '../../services/main/main';
import { ISidebarItems } from '../../models/interfaces';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  @Input() isViewSidebar: boolean = false;
  @Input() isPhoneScreen!: boolean;
  // @Input() isViewSidebar!: boolean;

  logo: string = 'pw-logo2.jpg';
  selectedReportTab = '';
  private allSubscriptions = new Subscription();
  activeTab: string = 'Dashboard';

  headerTitle: string = 'Dashboard';

  destroy$ = new Subject<void>();
  activeChildTab: string = '';

  sidebarItems: ISidebarItems[] = [
    {
      title: 'Dashboard',
      action: '/main/dashboard',
      isActive: true,
      icon: 'fa-solid fa-home',
    },

    {
      title: 'Transactions',
      action: '/main/transactions',
      isActive: false,
      icon: 'fa-solid fa-money-bill-transfer',
    },
    {
      title: 'Budgets',
      action: '/main/budgets',
      isActive: false,
      icon: 'fa-solid fa-coins',
    },
    {
      title: 'Reports',
      action: '/main/reports',
      isActive: false,
      icon: 'pi pi-chart-bar',
    },
    {
      title: 'Savings',
      action: '/main/savings',
      isActive: false,
      icon: 'fa-solid fa-piggy-bank',
      children: [
        {
          title: 'History',
          action: '/main/savings/history',
          isActive: false,
          icon: 'pi pi-target',
        },
        {
          title: 'Overview',
          action: '/main/savings/overview',
          isActive: false,
          icon: 'pi pi-eye',
        },
      ],
    },
  ];

  showChildrenMenu: boolean = false;
  constructor(
    private router: Router,
    private mainService: MainService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTab();
        this.setChildActiveTab();
      }
    });
    this.allSubscriptions.add(routerSub);

    this.setActiveTab();
    this.setChildActiveTab();
  }

  setActiveTab() {
    const currentUrl = this.router.url;
    const isActive = this.sidebarItems.find((item) =>
      currentUrl.includes(item.action)
    );
    if (isActive) {
      // this.activeTab = isActive.action;
      this.setOpenMenu(isActive);
    }
  }
  setChildActiveTab() {
    const currentUrl = this.router.url;

    this.sidebarItems.map((item) => {
      if (item.children) {
        const isActive = item.children.find((child) => {
          return currentUrl.includes(child.action);
        });
        if (isActive) {
          this.activeChildTab = isActive.action;
          this.showChildrenMenu = true;
        }
      } else {
        this.activeChildTab = '';
        this.showChildrenMenu = false;
      }
    });
  }

  setOpenMenu(item: any) {
    this.activeTab = item.action;
    // this.mainService.setHeaderTitle(item.title);
    this.mainService.headerTitle.set(item.title);
  }

  isActiveTab(item: ISidebarItems): boolean {
    return this.activeTab === item.action;
  }

  getActiveTab(item: ISidebarItems) {
    return this.activeTab === item.action;
  }

  closePhoneSidebar() {
    this.mainService.setViewSmallScreenSidebar(false);
  }

  navigateToPage(item: any) {
    this.setOpenMenu(item);
    this.activeChildTab = '';

    // this.activeTab = item.action;
    this.closePhoneSidebar();
    this.router.navigate([item.action]);
  }
  navigateToChildPage(item: any, event: any) {
    event.stopPropagation();
    this.setChildActiveTab();
    // this.activeTab = item.action;
    this.closePhoneSidebar();
    this.router.navigate([item.action]);
  }

  onShowChildren(item: ISidebarItems) {
    this.showChildrenMenu = !this.showChildrenMenu;
    this.mainService.setViewSidebar(true);
    // this.mainService.setViewSmallScreenSidebar(!this.isViewSidebar);
  }

  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: Event) {
  //   if (
  //     this.showChildrenMenu &&
  //     this.dropdownContainer &&
  //     !this.dropdownContainer.nativeElement.contains(event.target)
  //   ) {
  //     this.showChildrenMenu = false;
  //   }
  // }

  logOut() {
    this.mainService.resetNavigationState();
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
