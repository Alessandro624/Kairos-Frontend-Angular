import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
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
  protected isAdmin: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
    });
    this.authService.getUserRole().subscribe((roles) => {
      this.isAdmin = roles[0].authority == 'ROLE_ADMIN';
    })
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']).then(() => console.log('Home redirect successful'));
    console.log('User logged out.');
  }
}
