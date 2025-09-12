import {
  trigger,
  animate,
  style,
  group,
  query,
  transition,
  keyframes,
  state,
} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      style({ position: 'absolute', width: '100%', height: '100%' }),
      { optional: true }
    ),
    group([
      query(
        ':enter',
        [
          style({ opacity: 0, transform: 'translateX(100%)' }),
          animate(
            '1.6s ease-in-out',
            style({ opacity: 1, transform: 'translateX(0%)' })
          ),
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({ opacity: 1, transform: 'translateX(0%)' }),
          animate(
            '1.6s ease-in-out',
            style({ opacity: 0, transform: 'translateX(-100%)' })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);
export const routerTransitions = trigger('routerTransitions', [
  transition('* <=> *', [
    group([
      query(
        ':enter',
        style({
          transform: 'translateX({{ enterStart }}) scale({{ hiddenScale }})',
        }),
        { optional: true }
      ),
      query(
        ':leave',
        [
          animate(
            '750ms ease-in-out',
            style({
              transform: 'translateX({{ leaveEnd }}) scale({{ hiddenScale }})',
            })
          ),
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          animate(
            '750ms ease-in-out',
            style({ transform: 'translateX(0) scale(1)' })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

export const scrollAnimation = trigger('fadeInUp', [
  state(
    'hidden',
    style({
      opacity: 0,
      transform: 'translateY(80px)',
    })
  ),
  state(
    'visible',
    style({
      opacity: 1,
      transform: 'translateY(0)',
    })
  ),
  transition('hidden => visible', [animate('600ms ease-out')]),
  transition('visible => hidden', [animate('400ms ease-in')]),
]);

// export const routerTransitions = trigger('routerTransitions', [
//   transition('* <=> *', [
//     group([
//       query(
//         ':enter',
//         style({
//           transform: 'translateX({{ enterStart }}) scale({{ hiddenScale }})',
//         }),
//         { optional: true }
//       ),
//       query(
//         ':leave',
//         [
//           animate(
//             '750ms ease-in-out',
//             style({
//               transform: 'translateX({{ leaveEnd }}) scale({{ hiddenScale }})',
//             })
//           ),
//         ],
//         { optional: true }
//       ),
//       query(
//         ':enter',
//         [
//           animate(
//             '750ms ease-in-out',
//             style({ transform: 'translateX(0) scale(1)' })
//           ),
//         ],
//         { optional: true }
//       ),
//     ]),
//   ]),
// ]);

export const routerTransitions2 = trigger('fadeSlideInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate(
      '1000ms ease-out',
      style({ opacity: 1, transform: 'translateX(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '1000ms ease-in',
      style({ opacity: 0, transform: 'translateX(100%)' })
    ),
  ]),
]);
