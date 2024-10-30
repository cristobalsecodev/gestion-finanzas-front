import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { MiResumenComponent } from './finanzasPersonales/mi-resumen/mi-resumen.component';
import { MisInversionesComponent } from './finanzasPersonales/mis-inversiones/mis-inversiones.component';
import { MisIngresosGastosComponent } from './finanzasPersonales/mis-ingresos-gastos/mis-ingresos-gastos.component';
import { PresentacionComponent } from './bienvenida/presentation/presentacion.component';
import { LoginComponent } from './bienvenida/login/login.component';
import { authGuard } from './auth/guards/auth/auth.guard';
import { activateAccountRoute, createAccountRoute, incomeExpensesRoute, investmentsRoute, loginRoute, resumeRoute } from './shared/constants/variables.constants';
import { CreateAccountComponent } from './bienvenida/create-account/create-account.component';
import { ActivateAccountComponent } from './bienvenida/activate-account/activate-account.component';
import { activateAccountGuard } from './auth/guards/activateAccount/activate-account.guard';
import { actuallyLoggedGuard } from './auth/guards/actuallyLogged/actually-logged.guard';

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
    path: loginRoute, component: LoginComponent,
    canActivate: [actuallyLoggedGuard]
  },
  {
    path: createAccountRoute, component: CreateAccountComponent,
    canActivate: [actuallyLoggedGuard]
  },
  {
    path: activateAccountRoute, component: ActivateAccountComponent,
    canActivate: [activateAccountGuard]
  },
  {
    path: '', component: PresentacionComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];
