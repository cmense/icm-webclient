import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private auth: AuthService) { }

  canActivate() {
    if (this.auth.isAuthenticated()) {
      // logged in so return true
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}