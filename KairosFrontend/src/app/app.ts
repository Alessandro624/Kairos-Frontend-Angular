import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthenticationService} from './services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title: string = 'Kairos';
  protected currentYear: number = new Date().getFullYear();
  protected isLoggedIn: boolean = false;

  constructor(private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  logout(): void {
    this.authService.logout();
    console.log('User logged out.');
  }
}
