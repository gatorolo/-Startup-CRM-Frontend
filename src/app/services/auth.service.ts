import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, switchMap } from 'rxjs/operators';

export interface LoginPayload {
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Cuando conectes el backend, cambia esta URL:
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  /**
   * Realiza un login mockeado que acepta cualquier email y password.
   */
  login(payload: LoginPayload): Observable<any> {
    console.log('🔒 [MOCK] Solicitud de Login:', payload.email);

    // Simulamos una latencia y una validación básica
    return of(payload).pipe(
      delay(1500),
      switchMap(data => {
        if (!data.email || !data.password) {
          return throwError(() => new Error('Email y contraseña son obligatorios'));
        }
        // Retornamos un token inventado para simular éxito
        return of({
          success: true,
          token: 'mock-jwt-token-123456789',
          user: { email: data.email, role: 'admin' }
        });
      }),
      tap(response => console.log('✅ [MOCK] Login Exitoso:', response))
    );

    /*
    // VERSIÓN REAL (Descomentar cuando Java esté listo):
    // return this.http.post(`${this.apiUrl}/login`, payload);
    */
  }
}
