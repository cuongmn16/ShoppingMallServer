import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ShopCategories} from '../models/shop-categories';
import {ApiResponse} from '../models/api-response';
import {ProductImage} from '../models/product-image';
import {Products} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ManageProductService {
  private apiUrl = "http://localhost:8080/api"

  constructor(private http: HttpClient) { }

  addProduct(product: Products): Observable<ApiResponse<Products>> {
    return this.http.post<ApiResponse<Products>>(`${this.apiUrl}/products`, product);
  }

  getCategories(): Observable<ApiResponse<ShopCategories[]>> {
    return this.http.get<ApiResponse<ShopCategories[]>>(this.apiUrl + '/categories');
  }
  getProducts(search?: string, category?: string, stock?: string): Observable<ApiResponse<{ products: Products[]; stats: any }>> {
    let params = new HttpParams()
      .set('search', search || '')
      .set('category', category || '')
      .set('stock', stock || '');

    return this.http.get<ApiResponse<{ products: Products[]; stats: any }>>(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: number): Observable<Products> {
    return this.http.get<Products>(`${this.apiUrl}/${id}`);
  }

  getProductImages(productId: number): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(`${this.apiUrl}/${productId}/images`);
  }

  createProduct(product: Products): Observable<Products> {
    return this.http.post<Products>(this.apiUrl, product);
  }

  createProductImage(productId: number, image: ProductImage): Observable<ProductImage> {
    return this.http.post<ProductImage>(`${this.apiUrl}/${productId}/images`, image);
  }

  updateProduct(id: number, product: Products): Observable<Products> {
    return this.http.put<Products>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }




}
