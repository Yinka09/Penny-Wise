import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CircleProgressComponent,
  NgCircleProgressModule,
} from 'ng-circle-progress';
import { CircleProgress } from './circle-progress';

@NgModule({
  declarations: [CircleProgress],
  imports: [
    CommonModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300,
    }),
  ],
  exports: [CircleProgress],
})
export class CircleProgressModule {}
