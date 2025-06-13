import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../services';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css'
})
export class AuthCallback implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const refreshToken = params['refreshToken'];

      if (token && refreshToken) {
        this.authService.setTokens(token, refreshToken);
        this.router.navigate(['/home']).then(() => console.log('Login successful'));
      } else {
        this.error = 'Autenticazione non Avvenuta. Riprova.';
        console.error("Authentication tokens not found in URL query parameters.");
      }
    });
  }
}
