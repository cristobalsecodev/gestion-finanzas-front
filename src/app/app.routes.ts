import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { MiResumenComponent } from './finanzasPersonales/mi-resumen/mi-resumen.component';
import { MisInversionesComponent } from './finanzasPersonales/mis-inversiones/mis-inversiones.component';
import { MisIngresosGastosComponent } from './finanzasPersonales/mis-ingresos-gastos/mis-ingresos-gastos.component';
import { PresentacionComponent } from './bienvenida/presentacion/presentacion.component';
import { LoginComponent } from './bienvenida/login/login.component';
import { authGuard } from './guards/Autenticacion/auth.guard';

export const routes: Routes = [
  {
    path: 'mis-ingresos-gastos', 
    component: MisIngresosGastosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'mis-inversiones', 
    component: MisInversionesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'resumen', 
    component: MiResumenComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '', component: PresentacionComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];
