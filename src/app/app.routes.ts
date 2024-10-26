import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { MiResumenComponent } from './finanzasPersonales/mi-resumen/mi-resumen.component';
import { MisInversionesComponent } from './finanzasPersonales/mis-inversiones/mis-inversiones.component';
import { MisIngresosGastosComponent } from './finanzasPersonales/mis-ingresos-gastos/mis-ingresos-gastos.component';
import { PresentacionComponent } from './bienvenida/presentation/presentacion.component';
import { LoginComponent } from './bienvenida/login/login.component';
import { authGuard } from './guards/Auth/auth.guard';
import { incomeExpensesRoute, investmentsRoute, loginRoute, resumeRoute } from './shared/constants/variables.constants';

export const routes: Routes = [
  {
    path: incomeExpensesRoute, 
    component: MisIngresosGastosComponent,
    canActivate: [authGuard]
  },
  {
    path: investmentsRoute, 
    component: MisInversionesComponent,
    canActivate: [authGuard]
  },
  {
    path: resumeRoute, 
    component: MiResumenComponent,
    canActivate: [authGuard]
  },
  {
    path: loginRoute, component: LoginComponent
  },
  {
    path: '', component: PresentacionComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];
