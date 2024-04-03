import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  constructor(private authService: AuthService) { }
  isAdmin :boolean = false;

  ngOnInit() {
   if(this.authService.getCurrentUser()?.admin === true) {
    this.isAdmin=true
   };
  }

  logout(): void {
    this.isMenuOpen=false;
    this.authService.logout();
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
