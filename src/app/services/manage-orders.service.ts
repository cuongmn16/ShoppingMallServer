import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ApiResponse} from '../models/api-response';

import {Orders} from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class ManageOrdersService {
  private apiUrl = "http://localhost:8080/api/admin/orders";

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<ApiResponse<Orders[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ApiResponse<Orders[]> >(`${this.apiUrl}`, { headers })
  }

  viewOrderDetailByOrderId(orderId : number) : Observable<ApiResponse<Orders>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ApiResponse<Orders>>(`${this.apiUrl}/detail`, { headers })

  }

  updateStatusOrderById(orderId: number, status: string): Observable<ApiResponse<Orders>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<ApiResponse<Orders>>(`${this.apiUrl}/${orderId}/status`, { status }, { headers })

  }



}
