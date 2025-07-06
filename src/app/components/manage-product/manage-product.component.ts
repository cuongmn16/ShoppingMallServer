import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ProductImage} from '../../models/product-image';
import {ManageProductService} from '../../services/manage-product.service';
import {AddImageDialogComponent} from '../add-image-dialog/add-image-dialog.component';
import {Products} from '../../models/product';


@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ManageProductComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  products: Products[] = [];
  filteredProducts: Products[] = [];
  categories: { id: number; name: string }[] = [
    { id: 1, name: 'Điện tử' },
    { id: 2, name: 'Thời trang' },
    { id: 3, name: 'Gia dụng' },
    { id: 4, name: 'Sách' }
  ];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStock: string = '';
  isModalOpen: boolean = false;
  isConfirmModalOpen: boolean = false;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  currentEditId: number | null = null;
  deleteProductId: number | null = null;
  totalProducts: number = 0;
  totalValue: number = 0;
  lowStockCount: number = 0;
  productImages: { [key: number]: ProductImage[] } = {}; // Lưu hình ảnh theo productId

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private productService: ManageProductService) {
    this.initializeForm();
    this.initializeSearchSubscription();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.filterProducts();
    this.calculateStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(1)]],
      originalPrice: [0, [Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      categoryId: ['', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      soldQuantity: [0, [Validators.min(0)]],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      status: ['', Validators.required],
      description: [''],
      image: ['']
    });
  }

  private initializeSearchSubscription(): void {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
      this.filterProducts();
    });
  }

  addImage(): void {
    const dialogRef = this.dialog.open(AddImageDialogComponent, {
      width: '400px',
      data: { productId: this.currentEditId || null, imageUrl: '', isPrimary: false, displayOrder: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.currentEditId) {
        this.productService.createProductImage(this.currentEditId, result).subscribe(
          image => {
            this.loadProducts(); // Tải lại để cập nhật hình ảnh
            this.showNotification('Thêm ảnh thành công!', 'success');
          },
          error => this.showNotification('Lỗi khi thêm ảnh', 'error')
        );
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts(this.searchTerm, this.selectedCategory, this.selectedStock).subscribe(data => {
      this.products = data.result.products || []; // Lấy mảng products từ result
      const stats = data.result.stats || {}; // Lấy stats từ result
      const { totalProducts = 0, totalValue = 0, lowStockCount = 0 } = stats;
      this.totalProducts = totalProducts;
      this.totalValue = totalValue;
      this.lowStockCount = lowStockCount;
      this.filterProducts();
    });
  }


  filterProducts(): void {
    let filtered = [...this.products];
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchLower) || product.description?.toLowerCase().includes(searchLower)
      );
    }
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.categoryId?.toString() === this.selectedCategory);
    }
    if (this.selectedStock) {
      filtered = filtered.filter(product => {
        switch (this.selectedStock) {
          case 'high': return product.stockQuantity > 50;
          case 'medium': return product.stockQuantity >= 10 && product.stockQuantity <= 50;
          case 'low': return product.stockQuantity < 10;
          default: return true;
        }
      });
    }
    this.filteredProducts = filtered;
  }

  calculateStats(): void {
    this.totalProducts = this.products.length;
    this.totalValue = this.products.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0);
    this.lowStockCount = this.products.filter(product => product.stockQuantity < 10).length;
  }

  trackByProductId(index: number, product: Products): number {
    return product.productId!;
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.filterProducts();
  }

  getStockClass(stock: number): string {
    if (stock > 50) return 'stock-high';
    if (stock >= 10) return 'stock-medium';
    return 'stock-low';
  }

  openModal(): void {
    this.isEditMode = false;
    this.currentEditId = null;
    this.productForm.reset();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.productForm.reset();
    this.currentEditId = null;
    this.isSubmitting = false;
  }

  onModalBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  editProduct(product: Products): void {
    this.isEditMode = true;
    this.currentEditId = product.productId;

    this.productForm.patchValue({
      productName: product.productName,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      categoryId: product.categoryId?.toString() || '',
      stockQuantity: product.stockQuantity,
      soldQuantity: product.soldQuantity,
      rating: product.rating,
      status: product.productStatus,
      description: product.description,
      image: product.productImage || ''
    });

    this.isModalOpen = true;
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.productForm.value;
      const now = new Date();

      if (this.isEditMode && this.currentEditId) {
        this.productService.updateProduct(this.currentEditId, {
          ...formValue,
          categoryId: parseInt(formValue.categoryId),
          updatedAt: now
        }).subscribe(
          product => {
            this.loadProducts();
            this.closeModal();
            this.showNotification('Cập nhật sản phẩm thành công!', 'success');
          },
          error => this.showNotification('Lỗi khi cập nhật sản phẩm', 'error')
        );
      } else {
        this.productService.createProduct({
          ...formValue,
          sellerId: 1, // Giả lập sellerId, cần thay bằng logic thực tế
          categoryId: parseInt(formValue.categoryId),
          createdAt: now,
          updatedAt: now
        }).subscribe(
          product => {
            this.loadProducts();
            this.closeModal();
            this.showNotification('Thêm sản phẩm thành công!', 'success');
          },
          error => this.showNotification('Lỗi khi thêm sản phẩm', 'error')
        );
      }
    }
  }

  deleteProduct(id: number): void {
    this.deleteProductId = id;
    this.isConfirmModalOpen = true;
  }

  confirmDelete(): void {
    if (this.deleteProductId) {
      this.productService.deleteProduct(this.deleteProductId).subscribe(
        () => {
          this.loadProducts();
          this.showNotification(`Đã xóa sản phẩm`, 'success');
        },
        error => this.showNotification('Lỗi khi xóa sản phẩm', 'error')
      );
    }
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.isConfirmModalOpen = false;
    this.deleteProductId = null;
  }



  removeImage(productId: number, index: number): void {
    const image = this.productImages[productId][index];
    // Gọi API xóa hình ảnh (cần thêm endpoint backend)
    // Hiện tại chỉ xóa tạm thời trên frontend
    this.productImages[productId].splice(index, 1);
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    console.log(`${type.toUpperCase()}: ${message}`);
    if (type === 'error') {
      alert(`Lỗi: ${message}`);
    }
  }
}
