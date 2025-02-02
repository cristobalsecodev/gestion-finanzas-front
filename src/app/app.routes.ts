import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { MisInversionesComponent } from './finanzasPersonales/mis-inversiones/mis-inversiones.component';
import { IncomeOrExpenseComponent } from './finanzasPersonales/mis-ingresos-gastos/income-or-expense.component';
import { PresentacionComponent } from './bienvenida/presentation/presentacion.component';
import { LoginComponent } from './bienvenida/login/login.component';
import { authGuard } from './auth/guards/auth/auth.guard';
import { activateAccountRoute, signUpRoute, incomeExpensesRoute, investmentsRoute, loginRoute, newPasswordRoute } from './shared/constants/variables.constants';
import { CreateAccountComponent } from './bienvenida/create-account/create-account.component';
import { ActivateAccountComponent } from './bienvenida/activate-account/activate-account.component';
import { activateAccountGuard } from './auth/guards/activateAccount/activate-account.guard';
import { actuallyLoggedGuard } from './auth/guards/actuallyLogged/actually-logged.guard';
import { NewPasswordComponent } from './shared/components/new-password/new-password.component';

export const routes: Routes = [
  {
    path: incomeExpensesRoute, 
    component: IncomeOrExpenseComponent,
    canActivate: [authGuard]
  },
  {
    path: investmentsRoute, 
    component: MisInversionesComponent,
    canActivate: [authGuard]
  },
  {
    path: `${newPasswordRoute}/:urlToken`, 
    component: NewPasswordComponent
  },
  {
    path: loginRoute, component: LoginComponent,
    canActivate: [actuallyLoggedGuard]
  },
  {
    path: signUpRoute, component: CreateAccountComponent,
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
