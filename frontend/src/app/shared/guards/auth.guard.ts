import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    
    if (!this.authService.getCurrentUser()?.active) {
      console.log('user',this.authService.getCurrentUser())
      this.router.navigate(['/login']);
      return false;
    } 
    return true;
  }
}
