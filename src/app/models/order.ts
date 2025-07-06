// models/order.model.ts
import {Addresses} from './addresses';
import {OrderItem} from './order-item';


export interface Orders {
  orderId: number;
  userId: number;
  shippingAddressId : number;
  status: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  shippingAddress: Addresses;
  orderItems: OrderItem[];
  createAt: string;
  updateAt: string;
}



