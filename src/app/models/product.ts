import {ProductImage} from './product-image';
import {ProductVariation} from './product-variation';

export interface Product {
  sellerId: number;
  categoryId: number;
  productName: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stockQuantity: number;
  soldQuantity: number;
  rating: number;
  productStatus: string;
  productImage: string;
  productImages: ProductImage[];
  variations: ProductVariation[];
  optionInputs: { [key: string]: string[] };
}
