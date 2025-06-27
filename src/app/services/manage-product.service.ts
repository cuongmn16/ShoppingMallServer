import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product';
import {Observable} from 'rxjs';
import {ShopCategories} from '../models/shop-categories';
import {ApiResponse} from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ManageProductService {
  private baseUrl = "http://localhost:8080/api"

  constructor(private http: HttpClient) { }

  addProduct(product: Product): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/products`, product);
  }

  getCategories(): Observable<ApiResponse<ShopCategories[]>> {
    return this.http.get<ApiResponse<ShopCategories[]>>(this.baseUrl + '/categories');
  }




}
