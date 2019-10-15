import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoginAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isLoggedIn.pipe(
      map(isLoggedIn => !isLoggedIn),
      tap(isLoggedOut => {
        if (!isLoggedOut) {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }
}
