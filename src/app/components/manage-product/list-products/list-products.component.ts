import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-list-products',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,

  ],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {
  currentStep: number = 1;
  variationCount: number = 0;

  ngOnInit(): void {}

  openModal(): void {
    const modal = document.getElementById('addProductModal');
    if (modal) {
      (modal as HTMLElement).style.display = 'flex';
      this.currentStep = 1;
      this.variationCount = 0;
      this.updateVariations();
      this.updateOptions();
    }
  }

  closeModal(): void {
    const modal = document.getElementById('addProductModal');
    if (modal) {
      (modal as HTMLElement).style.display = 'none';
    }
    const form = document.getElementById('productForm');
    if (form) {
      (form as HTMLFormElement).reset();
    }
    this.currentStep = 1;
  }

  showStep(step: number): void {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((stepDiv) => {
      (stepDiv as HTMLElement).classList.remove('active');
    });
    const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);
    if (activeStep) {
      (activeStep as HTMLElement).classList.add('active');
    }
  }

  nextStep(step: number): void {
    if (this.validateStep(this.currentStep)) {
      this.currentStep = step;
      this.showStep(this.currentStep);
      if (step === 3) {
        this.updateOptions();
      }
    }
  }

  prevStep(step: number): void {
    this.currentStep = step;
    this.showStep(this.currentStep);
  }

  validateStep(step: number): boolean {
    let isValid = true;
    if (step === 1) {
      const productName = document.getElementById('productName') as HTMLInputElement;
      const productPrice = document.getElementById('productPrice') as HTMLInputElement;
      if (!productName?.value || !productPrice?.value) {
        alert('Vui lòng điền Tên sản phẩm và Giá!');
        isValid = false;
      }
    } else if (step === 2) {
      const variations = document.getElementById('variations')?.getElementsByClassName('variation-item');
      if (variations && variations.length === 0) {
        alert('Vui lòng thêm ít nhất một biến thể!');
        isValid = false;
      } else if (variations) {
        for (let variation of Array.from(variations)) {
          const sku = (variation.querySelector('input[id^="sku"]') as HTMLInputElement)?.value;
          const price = (variation.querySelector('input[id^="price"]') as HTMLInputElement)?.value;
          const quantity = (variation.querySelector('input[id^="quantity"]') as HTMLInputElement)?.value;
          if (!sku || !price || !quantity) {
            alert('Vui lòng điền đầy đủ thông tin cho tất cả biến thể!');
            isValid = false;
            break;
          }
        }
      }
    }
    return isValid;
  }

  addVariation(): void {
    const variationsDiv = document.getElementById('variations');
    if (variationsDiv) {
      const variationId = this.variationCount++;
      const variationHTML = `
        <div class="variation-item">
          <div class="form-group">
            <label for="sku${variationId}">SKU</label>
            <input type="text" id="sku${variationId}" name="sku${variationId}" required>
          </div>
          <div class="form-group">
            <label for="price${variationId}">Giá (VNĐ)</label>
            <input type="number" id="price${variationId}" name="price${variationId}" step="0.01" required min="0">
          </div>
          <div class="form-group">
            <label for="quantity${variationId}">Số lượng</label>
            <input type="number" id="quantity${variationId}" name="quantity${variationId}" required min="0">
          </div>
          <button type="button" class="remove-variation-btn" (click)="removeVariation($event)">Xóa</button>
        </div>
      `;
      variationsDiv.insertAdjacentHTML('beforeend', variationHTML);
    }
  }

  removeVariation(event: Event): void {
    const button = event.target as HTMLButtonElement;
    if (button.parentElement) {
      button.parentElement.remove();
    }
  }

  updateVariations(): void {
    const variationsDiv = document.getElementById('variations');
    if (variationsDiv) {
      variationsDiv.innerHTML = `
        <div class="variation-item">
          <div class="form-group">
            <label for="sku0">SKU</label>
            <input type="text" id="sku0" name="sku0" required>
          </div>
          <div class="form-group">
            <label for="price0">Giá (VNĐ)</label>
            <input type="number" id="price0" name="price0" step="0.01" required min="0">
          </div>
          <div class="form-group">
            <label for="quantity0">Số lượng</label>
            <input type="number" id="quantity0" name="quantity0" required min="0">
          </div>
          <button type="button" class="remove-variation-btn" (click)="removeVariation($event)">Xóa</button>
        </div>
      `;
    }
  }

  updateOptions(): void {
    const variationOptionsDiv = document.getElementById('variationOptions');
    if (variationOptionsDiv) {
      variationOptionsDiv.innerHTML = '';
      const variations = document.getElementById('variations')?.getElementsByClassName('variation-item');
      if (variations) {
        for (let i = 0; i < variations.length; i++) {
          const variationId = i;
          const optionHTML = `
            <div class="variation-item" data-variation-id="${variationId}">
              <h4>Biến thể ${i + 1}</h4>
              <div class="form-group">
                <label for="options${variationId}">Tùy chọn</label>
                <select id="options${variationId}" name="options${variationId}" multiple>
                  <option value="1">Màu Đen</option>
                  <option value="2">Màu Trắng</option>
                  <option value="3">Size S</option>
                  <option value="4">Size M</option>
                </select>
              </div>
            </div>
          `;
          variationOptionsDiv.insertAdjacentHTML('beforeend', optionHTML);
        }
      }
    }
  }

  onSubmit(): void {
    if (this.validateStep(this.currentStep)) {
      alert('Sản phẩm đã được thêm! (Chức năng demo)');
      this.closeModal();
    }
  }

}
