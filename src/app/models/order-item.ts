import {Products} from './product';
import {ProductVariation} from './product-variation';

export interface OrderItem{
  itemId : number;
  orderId : number;
  productId : number;
  variationId : number;
  quantity : number;
  unitPrice : number;
  totalPrice : number;
  variationOptions : VariationOption[];
  product : Products;
  productVariation : ProductVariation;
}

export interface VariationOption {
  type: string;
  value: string;
}
