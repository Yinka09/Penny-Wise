import { Component, Input, type OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-circle-progress',

  templateUrl: './circle-progress.html',
  styleUrl: './circle-progress.scss',
})
export class CircleProgress implements OnInit {
  @Input() progressData: any;

  ngOnInit(): void {}
}
