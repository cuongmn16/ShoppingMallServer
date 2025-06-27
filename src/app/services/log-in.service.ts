import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationRequest} from '../models/authentication-request';
import {ApiResponse} from '../models/api-response';
import {AuthenticationResponse} from '../models/authentication-response';

@Injectable({
  providedIn: 'root'
})
export class LogInService {
  private baseUrl = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) { }

  login(credentials: AuthenticationRequest): Observable<ApiResponse<AuthenticationResponse>> {
    return this.http.post<ApiResponse<AuthenticationResponse>>(this.baseUrl + '/token', credentials);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

}
