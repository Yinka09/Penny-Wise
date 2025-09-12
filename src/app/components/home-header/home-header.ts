import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-home-header',
  imports: [],
  templateUrl: './home-header.html',
  styleUrl: './home-header.scss',
})
export class HomeHeader implements OnInit {
  showMobileMenu: boolean = false;
  @Output() scrollEmitter = new EventEmitter<string>();
  ngOnInit(): void {}
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  constructor(private router: Router) {}

  scrollToSection(sectionName: string) {
    this.showMobileMenu = false;
    this.scrollEmitter.emit(sectionName);
  }

  navigateToAuth(route: string) {
    this.showMobileMenu = false;
    const url = this.router.serializeUrl(this.router.createUrlTree([route]));
    window.open(url, '_blank');
  }
}
