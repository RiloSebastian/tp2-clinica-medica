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
          bottom: 0,
          right: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ bottom: '-100%' })
      ]),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [
          animate('500ms ease-out', style({ bottom: '100%' }))
        ], {optional: true}),
        query(':enter', [
          animate('500ms ease-out', style({ bottom: '0%' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('* => Perfil', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          opacity: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ opacity: 0 })
      ]),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [
          animate('600ms ease-out', style({ opacity: 0 }))
        ], {optional: true}),
        query(':enter', [
          animate('600ms ease-out', style({ opacity: 1 }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('* => Listados, *=>Turnos', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          right: 0,
          opacity: 0,
          width: '100%',
          transform: 'scale(0) translateY(100%)'
        })
      ]),
      query(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease',style({
          opacity: 1, 
          transform: 'scale(1) translateY(0%)'
        })),
      ]),
    ]),
    transition('Listados=> *, Turnos=>*', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          right: 0,
          opacity: 1,
          width: '100%',
          transform: 'scale(1) translateY(0%)'
        })
      ]),
      query(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease',style({
          opacity: 0, 
          transform: 'scale(0) translateY(100%)'
        })),
      ]),
    ])
  ]);