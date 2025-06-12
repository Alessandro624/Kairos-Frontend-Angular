import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title: string = 'Kairos';
  protected currentYear: number = new Date().getFullYear();

  isLoggedIn(): boolean {
    const authToken = localStorage.getItem('auth_token');
    const expiryDateString = localStorage.getItem('auth_token_expiry');

    if (!authToken || !expiryDateString) {
      return false;
    }

    const expiryDate = new Date(expiryDateString);
    const now = new Date();

    if (expiryDate <= now) {
      console.warn('Auth token expired.');
      this.logout();
      return false;
    }

    return true;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_token_expiry');

    console.log('User logged out.');
  }
}
