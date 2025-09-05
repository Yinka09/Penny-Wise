import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MainService } from '../../services/main/main';
import { ISidebarItems } from '../../models/interfaces';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  @Input() isViewSidebar: boolean = false;
  @Input() isPhoneScreen!: boolean;
  // @Input() isViewSidebar!: boolean;
  logo: string = 'pw-logo2.jpeg';
  selectedReportTab = '';
  private allSubscriptions = new Subscription();
  activeTab: string = 'Dashboard';

  headerTitle: string = 'Dashboard';

  destroy$ = new Subject<void>();

  sidebarItems: ISidebarItems[] = [
    {
      title: 'Dashboard',
      action: '/main/dashboard',
      isActive: true,
      icon: 'pi pi-home',
    },

    {
      title: 'Transactions',
      action: '/main/transactions',
      isActive: false,
      icon: 'pi pi-credit-card',
    },
    {
      title: 'Budgets',
      action: '/main/budgets',
      isActive: false,
      icon: 'pi pi-briefcase',
    },

    {
      title: 'Reports',
      action: '/main/reports',
      isActive: false,
      icon: 'pi pi-chart-bar',
    },
  ];

  constructor(private router: Router, private mainService: MainService) {}

  ngOnInit(): void {
    const routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTab();
      }
    });
    this.allSubscriptions.add(routerSub);

    this.setActiveTab();
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

    // this.activeTab = item.action;
    this.closePhoneSidebar();
    this.router.navigate([item.action]);
  }

  logOut() {
    this.mainService.resetNavigationState();
  }

  ngOnDestroy(): void {
    this.allSubscriptions.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
