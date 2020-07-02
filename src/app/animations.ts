import { trigger, transition, style, query, group, animateChild, animate } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Home => Login, Registro => Home, Registro => Login', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('500ms ease-out', style({ left: '100%' }))
        ]),
        query(':enter', [
          animate('500ms ease-out', style({ left: '0%' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Login => Home, Home => Registro, Login => Registro', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ right: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('500ms ease-out', style({ right: '100%' }))
        ]),
        query(':enter', [
          animate('500ms ease-out', style({ right: '0%' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Login => Principal, Registro => Principal', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ top: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('500ms ease-out', style({ top: '100%' }))
        ]),
        query(':enter', [
          animate('500ms ease-out', style({ top: '0%' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('* => Home', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ bottom: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('500ms ease-out', style({ bottom: '100%' }))
        ]),
        query(':enter', [
          animate('500ms ease-out', style({ bottom: '0%' }))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);