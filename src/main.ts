import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from './environments/environment';
import { TokenService } from './app/shared/services/token.service';

// Create a functional interceptor for authentication
const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Only add auth header for API requests
  if (req.url.startsWith(environment.apiUrl)) {
    const tokenService = inject(TokenService);
    const token = tokenService.getToken();

    console.log('Auth Interceptor - URL:', req.url);
    console.log('Auth Interceptor - Token exists:', !!token);

    if (token) {
      console.log('Auth Interceptor - Adding token to request');
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(req);
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(err => console.error(err));