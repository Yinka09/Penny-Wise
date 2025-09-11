import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-header',
  imports: [RouterLink],
  templateUrl: './home-header.html',
  styleUrl: './home-header.scss',
})
export class HomeHeader implements OnInit {
  showMobileMenu: boolean = false;
  ngOnInit(): void {}
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
