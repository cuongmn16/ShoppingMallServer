import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Product} from '../../../models/product';
import {ProductImage} from '../../../models/product-image';
import {ProductVariation} from '../../../models/product-variation';
import {ManageProductService} from '../../../services/manage-product.service';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {ShopCategories} from '../../../models/shop-categories';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ ReactiveFormsModule,CommonModule, HttpClientModule, MatDialogModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']

})

export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  currentStep: number = 1;
  isCategoriesLoaded: boolean = false;
  categories : ShopCategories[] = [];
  productImages: ProductImage[] = [];
  productVariations: ProductVariation[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ManageProductService,
    private cdr: ChangeDetectorRef
    ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: [''],
      originalPrice: [, Validators.min(0)],
      discount: [, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [, [Validators.required, Validators.min(0)]],
      productStatus: [''],
      productImage: [''],
      categories: [['', Validators.required]],
      variations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addVariation();
  }


  loadCategories(): void {
    if (!this.isCategoriesLoaded) { // Chỉ load lần đầu
      this.productService.getCategories().subscribe({
        next: (data) => {
          this.categories = data.result;
          this.isCategoriesLoaded = true; // Đánh dấu đã load
          this.cdr.detectChanges(); // Đảm bảo render
        },
        error: (err) => {
          console.error('Lỗi khi lấy categories:', err);
        }
      });
    }
  }


  get variations(): FormArray {
    return this.productForm.get('variations') as FormArray;
  }

  addVariation(): void {
    const variation = this.fb.group({
      sku: [''],
      price: [0.0],
      quantity: [0],
      optionInputs: [[]]
    });
    this.variations.push(variation);
    this.productVariations.push({ sku: '', price: 0.0, quantity: 0, optionInputs: [] });
  }

  removeVariation(index: number): void {
    this.variations.removeAt(index);
    this.productVariations.splice(index, 1);
  }

  addImage(): void {
    const image: ProductImage = { imageUrl: '', isPrimary: this.productImages.length === 0, displayOrder: this.productImages.length + 1 };
    this.productImages.push(image);
  }

  removeImage(index: number): void {
    this.productImages.splice(index, 1);
    this.productImages.forEach((img, i) => {
      img.displayOrder = i + 1;
      img.isPrimary = i === 0;
    });
  }

  addOption(index: number): void {
    const input = prompt('Nhập tùy chọn (ví dụ: Color: Blue):');
    if (input) {
      this.productVariations[index].optionInputs.push(input);
      this.variations.at(index).get('optionInputs')?.setValue(this.productVariations[index].optionInputs);
    }
  }

  removeOption(index: number, optionIndex: number): void {
    this.productVariations[index].optionInputs.splice(optionIndex, 1);
    this.variations.at(index).get('optionInputs')?.setValue(this.productVariations[index].optionInputs);
  }

  nextStep(): void {
    if (this.validateStep()) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    this.currentStep--;
  }

  validateStep(): boolean {
    if (this.currentStep === 1) {
      return this.productForm.get('productName')?.value && this.productForm.get('price')?.value >= 0;
    } else if (this.currentStep === 2) {
      return this.variations.length > 0 && this.variations.controls.every(v =>
        v.get('sku')?.value && v.get('price')?.value >= 0 && v.get('quantity')?.value >= 0
      );
    }
    return true;
  }

  onSubmit(): void {
    if (this.productForm.valid) { // Kiểm tra valid thay vì validateStep nếu dùng validation
      const productData: Product = {
        sellerId: 1,
        categoryId: 1,
        productName: this.productForm.get('productName')?.value,
        description: this.productForm.get('description')?.value,
        price: this.productForm.get('price')?.value,
        originalPrice: this.productForm.get('originalPrice')?.value,
        discount: this.productForm.get('discount')?.value,
        stockQuantity: this.productForm.get('stockQuantity')?.value,
        soldQuantity: this.productForm.get('soldQuantity')?.value,
        rating: this.productForm.get('rating')?.value,
        productStatus: this.productForm.get('productStatus')?.value,
        productImage: this.productForm.get('productImage')?.value,
        productImages: this.productImages,
        variations: this.productVariations,
        optionInputs: this.productVariations.reduce((acc, curr) => {
          curr.optionInputs.forEach(input => {
            const [type, value] = input.split(':').map(s => s.trim());
            if (!acc[type]) acc[type] = [];
            if (!acc[type].includes(value)) acc[type].push(value);
          });
          return acc;
        }, {} as { [key: string]: string[] })
      };
      this.productService.addProduct(productData).subscribe(
        response => {
          console.log('Product added:', response);
          alert('Sản phẩm đã được thêm!');
          this.resetForm();
        },
        error => {
          console.error('Error adding product:', error);
          alert('Lỗi khi thêm sản phẩm!');
        }
      );
    }
  }

  private resetForm(): void {
    this.currentStep = 1;
    this.productForm.reset();
    this.productImages = [];
    this.productVariations = [];
    this.variations.clear();
    this.addVariation();
  }
}
