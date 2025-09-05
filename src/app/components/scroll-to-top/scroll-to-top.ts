import {
  Component,
  HostListener,
  Inject,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  imports: [CommonModule],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
})
export class ScrollToTop implements OnInit, OnDestroy {
  @Input() scrollContainer?: any;
  // @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  showButton = false;

  private boundScrollHandler: any;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    if (this.scrollContainer) {
      const element =
        this.scrollContainer.nativeElement || this.scrollContainer;

      this.boundScrollHandler = this.onContainerScroll.bind(this);

      element.addEventListener('scroll', this.boundScrollHandler);
    }
  }

  ngOnDestroy() {
    if (this.scrollContainer && this.boundScrollHandler) {
      const element =
        this.scrollContainer.nativeElement || this.scrollContainer;
      element.removeEventListener('scroll', this.boundScrollHandler);
    }
  }

  onContainerScroll() {
    if (this.scrollContainer) {
      const element =
        this.scrollContainer.nativeElement || this.scrollContainer;
      const scrollPosition = element.scrollTop;
      this.showButton = scrollPosition > 200;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.scrollContainer) {
      const scrollPosition =
        window.pageYOffset ||
        this.document.documentElement.scrollTop ||
        this.document.body.scrollTop ||
        0;
      this.showButton = scrollPosition > 200;
    }
  }

  scrollToTop() {
    if (this.scrollContainer) {
      const element =
        this.scrollContainer.nativeElement || this.scrollContainer;
      element.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
