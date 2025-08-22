import { Component, type OnDestroy, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HeaderComponent } from '../../components/header/header';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { MainService } from '../../services/main/main';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class MainComponent implements OnInit, OnDestroy {
  isViewSidebar = true;
  isViewSmallScreenSidebar = true;
  isPhoneScreen = false;

  destroy$ = new Subject<void>();
  constructor(
    private mainService: MainService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.mainService.getViewSidebar().subscribe((value) => {
      this.isViewSidebar = value;
    });

    this.mainService.getViewSmallScreenSidebar().subscribe((value) => {
      this.isViewSmallScreenSidebar = value;
    });

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$)) // pre-defined "phone" breakpoint
      .subscribe((result) => {
        this.isPhoneScreen = result.matches;
      });
  }

  ngOnDestroy(): void {
    // this.mainService.setViewSidebar(this.isViewSidebar);
    // this.mainService.setViewSmallScreenSidebar(this.isViewSmallScreenSidebar);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
