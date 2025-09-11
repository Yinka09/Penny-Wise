import { Component } from '@angular/core';
import { HomeHeader } from '../../components/home-header/home-header';
import { Hero } from '../../components/hero/hero';
import { GridSection } from '../../components/grid-section/grid-section';
import { HomeFooter } from '../../components/home-footer/home-footer';

@Component({
  selector: 'app-home',
  imports: [HomeHeader, Hero, GridSection, HomeFooter],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  firstTextSizeArray = [
    'text-[1.8rem]',
    'md:text-[1.9rem]',
    'lg:text-[2.8rem]',
  ];
  secondTextSizeArray = [
    'text-[1.5rem]',
    'md:text-[1.5rem]',
    'lg:text-[2.1rem]',
  ];

  firstTitle = 'Master Your Money Effortlessly';
  secondTitle = 'Unlock Your Financial Potential';

  firstDescription =
    'PennyWise empowers you to track your expenses, set budgets, and achieve your financial goals with intuitive tools and intelligent insights. With real-time tracking, personalized insights, and progress updates, PennyWise makes saving and spending smarter, easier, and stress-free.';

  secondDescription =
    "PennyWise isn't just about tracking, it's about empowering you to make informed decisions, save more, and invest wisely. Our smart insights help you identify spending patterns and optimize your financial future.";
  // firstImgSrc = 'landing-page/hero2-img.png';
  firstImgSrc = 'reports/header-img.png';
  secondImgSrc = 'landing-page/hero2-img.png';

  firstGridTitle = 'Smart Features For Financial Freedom';
  secondGridTitle = 'Experience PennyWise in Action';
}
