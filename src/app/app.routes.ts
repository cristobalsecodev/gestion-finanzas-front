import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LoginComponent } from './bienvenida/login/login.component';
import { activateAccountRoute, signUpRoute, incomeExpensesRoute, newPasswordRoute, loginRoute } from './shared/constants/variables.constants';
import { CreateAccountComponent } from './bienvenida/create-account/create-account.component';
import { ActivateAccountComponent } from './bienvenida/activate-account/activate-account.component';
import { NewPasswordComponent } from './shared/components/new-password/new-password.component';
import { AuthResolverService } from './auth/service/resolvers/AuthResolver/auth-resolver.service';
import { NewPasswordResolverService } from './auth/service/resolvers/NewPasswordResolver/new-password-resolver.service';
import { LoggedResolverService } from './auth/service/resolvers/LoggedResolver/logged-resolver.service';
import { ActivateAccountResolverService } from './auth/service/resolvers/ActivateAccountResolver/activate-account-resolver.service';
import { IncomeOrExpenseComponent } from './mis-ingresos-gastos/income-or-expense.component';

export const routes: Routes = [
  {
    path: incomeExpensesRoute, 
    component: IncomeOrExpenseComponent,
    resolve: { auth: AuthResolverService }
  },
  {
    path: `${newPasswordRoute}/:urlToken`, 
    component: NewPasswordComponent,
    resolve: { auth: NewPasswordResolverService }
  },
  {
    path: signUpRoute, component: CreateAccountComponent,
    resolve: { auth: LoggedResolverService }
  },
  {
    path: activateAccountRoute, component: ActivateAccountComponent,
    resolve: { auth: ActivateAccountResolverService }
  },
  {
    path: loginRoute, 
    component: LoginComponent,
    resolve: { auth: LoggedResolverService }
  },
  {
    path: '', redirectTo: incomeExpensesRoute, pathMatch: 'full'
  },
  {
    path: '**', component: NotFoundComponent
  }
];
