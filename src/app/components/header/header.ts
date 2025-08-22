import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../../services/main/main';
import { take } from 'rxjs/internal/operators/take';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  userInitials: string = '';
  title: string = '';
  isViewSidebar!: boolean;

  allSubscriptions = new Subscription();

  // viewSidebar$ = this.mainService.getViewSidebar();
  constructor(private mainService: MainService) {}
  ngOnInit(): void {
    const savedInitials = sessionStorage.getItem('userInitials') || '';
    this.userInitials = this.getUserInitialsArray(savedInitials);

    console.log('User Initials:', this.userInitials);

    this.mainService.headerTitle$.pipe(take(1)).subscribe((title: string) => {
      this.title = title;
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
}
