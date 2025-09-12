import {
  Component,
  ViewChild,
  type AfterViewInit,
  type ElementRef,
  type OnInit,
} from '@angular/core';
import { HomeHeader } from '../../components/home-header/home-header';
import { Hero } from '../../components/hero/hero';
import { GridSection } from '../../components/grid-section/grid-section';
import { HomeFooter } from '../../components/home-footer/home-footer';
import { Router, ActivatedRoute } from '@angular/router';
import { MatMenuContent } from '@angular/material/menu';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { scrollAnimation } from '../../services/animation/animation';

@Component({
  selector: 'app-home',
  imports: [HomeHeader, Hero, GridSection, HomeFooter],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  animations: [scrollAnimation],
  // animations: [
  //   trigger('fadeInUp', [
  //     state(
  //       'hidden',
  //       style({
  //         opacity: 0,
  //         transform: 'translateY(100px)',
  //       })
  //     ),
  //     state(
  //       'visible',
  //       style({
  //         opacity: 1,
  //         transform: 'translateY(0)',
  //       })
  //     ),
  //     transition('hidden => visible', [animate('600ms ease-out')]),
  //     transition('visible => hidden', [animate('400ms ease-in')]),
  //   ]),
  // ],
})
export class Home implements OnInit, AfterViewInit {
  @ViewChild('features') features!: ElementRef;
  @ViewChild('benefits') benefits!: ElementRef;
  @ViewChild('experience') experience!: ElementRef;
  @ViewChild('contact') contact!: ElementRef;

  sectionStates: { [key: string]: 'hidden' | 'visible' } = {
    features: 'hidden',
    benefits: 'hidden',
    experience: 'hidden',
    contact: 'hidden',
  };
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

  private sectionMap: Record<string, ElementRef> = {};

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.sectionMap = {
      features: this.features,
      benefits: this.benefits,
      experience: this.experience,
      contact: this.contact,
    };

    this.activatedRoute.fragment.subscribe((fragment) => {
      if (fragment) {
        this.scrollToSection(fragment);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionKey = Object.keys(this.sectionMap).find(
            (key) => this.sectionMap[key].nativeElement === entry.target
          );

          if (!sectionKey) return;

          if (entry.isIntersecting) {
            this.sectionStates[sectionKey] = 'visible';
          } else {
            this.sectionStates[sectionKey] = 'hidden';
          }
        });
      },
      { threshold: 0.2 }
      // { threshold: 0.2 }
    );

    observer.observe(this.features.nativeElement);
    observer.observe(this.benefits.nativeElement);
    observer.observe(this.experience.nativeElement);
    observer.observe(this.contact.nativeElement);
  }

  scrollToSection(sectionName: any) {
    // console.log('Scrolling to section:', sectionName);
    const element = this.sectionMap[sectionName]?.nativeElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  navigateToSection(section: string) {
    this.router.navigate(['/home'], { fragment: `${section}-section` });
  }
}
