import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { incomeExpensesRoute } from 'src/app/shared/constants/variables.constants';
import { TokenService } from 'src/app/shared/services/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedResolverService {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if(this.tokenService.isAuthenticated()) {

      this.router.navigate([incomeExpensesRoute])

      return of(false)

    }

    return of(true)

  }
}
