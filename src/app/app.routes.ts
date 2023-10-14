import { Routes } from '@angular/router';
import { MisdatosComponent } from './components/misdatos/misdatos.component';
import { ForoComponent } from './components/foro/foro.component';
import { MisclasesComponent } from './components/misclases/misclases.component';
import { QrComponent } from './components/qr/qr.component';
import { loginGuard } from './guards/login-guard.service';
import { authGuard } from './guards/auth-guard.service';


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    children: [
      {
        path: 'qr', 
        component: QrComponent
      },
      {
        path: 'misclases',
        component: MisclasesComponent
      },
      {
        path: 'foro',
        component: ForoComponent
      },
      {
        path: 'misdatos',
        component: MisdatosComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [loginGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.page').then( m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'pregunta',
    loadComponent: () => import('./pages/pregunta/pregunta.page').then( m => m.PreguntaPage)
  },
  {
    path: 'correcto',
    loadComponent: () => import('./pages/correcto/correcto.page').then( m => m.CorrectoPage)
  },
  {
    path: 'incorrecto',
    loadComponent: () => import('./pages/incorrecto/incorrecto.page').then( m => m.IncorrectoPage)
  },
  {
    path: 'correo',
    loadComponent: () => import('./pages/correo/correo.page').then(m => m.CorreoPage)
  }
];
