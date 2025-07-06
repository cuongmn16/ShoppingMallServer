import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Orders} from '../../models/order';
import {ManageOrdersService} from '../../services/manage-orders.service';
import {ActivatedRoute} from '@angular/router';
import {OrderItem} from '../../models/order-item';



@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss'
})


export class ManageOrderComponent implements OnInit {
  orders: Orders[] = [];
  filteredOrders : Orders[] = [];
  orderId! : number;
  selectedStatus: string = 'all';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Modal
  showOrderDetail: boolean = false;
  selectedOrder: Orders | null = null;

  // Stats
  totalOrders: number = 0;
  pendingOrders: number = 0;
  completedOrders: number = 0;

  constructor(private mangeOrderService : ManageOrdersService,
              private route : ActivatedRoute) {
  }

  ngOnInit() {
    this.updateStats();
    this.loadOrders()
  }

  loadOrders(){
    this.mangeOrderService.getAllOrders().subscribe({
      next: (response) => {
          this.orders = response.result;
          this.filterOrders();
          this.updateStats();

      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }

    });
  }

  updateStats() {
    this.totalOrders = this.orders.length;
    this.pendingOrders = this.orders.filter(order => order.status === 'pending').length;
    this.completedOrders = this.orders.filter(order => order.status === 'delivered').length;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.filterOrders();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.filterOrders();
  }

  filterOrders() {
    let filtered = this.orders;
    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(orders =>
        orders.orderId.toString().toLowerCase().includes(searchLower)||
        orders.shippingAddress.recipientName.toLowerCase().includes(searchLower) ||
        orders.shippingAddress.phone.includes(searchLower)
      );
    }

    this.filteredOrders = filtered;
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.paginateOrders();
  }

  paginateOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterOrders();
    }
  }

  getOrdersByStatus(status: string): Orders[] {
    return this.orders.filter(order => order.status === status);
  }

  getStatusClass(status: string): string {
    return status;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'shipping': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  }

  // Order Actions
  //   confirmOrder(orderId: string) {
  //     const order = this.orders.find(o => o.orderId === orderId);
  //     if (order) {
  //       order.status = 'confirmed';
  //       this.updateStats();
  //       this.filterOrders();
  //     }
  //   }
  //
  // cancelOrder(orderId: string) {
  //   if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
  //     const order = this.orders.find(o => o.id === orderId);
  //     if (order) {
  //       order.status = 'cancelled';
  //       order.timeline = [
  //         ...order.timeline.slice(0, 1),
  //         { title: 'Đơn hàng bị hủy', time: new Date(), completed: true }
  //       ];
  //       this.updateStats();
  //       this.filterOrders();
  //     }
  //   }
  // }
  //
  // startShipping(orderId: string) {
  //   const order = this.orders.find(o => o.id === orderId);
  //   if (order) {
  //     order.status = 'shipping';
  //     order.timeline[2].completed = true;
  //     order.timeline[2].time = new Date();
  //     this.updateStats();
  //     this.filterOrders();
  //   }
  // }

  // completeOrder(orderId: string) {
  //   const order = this.orders.find(o => o.id === orderId);
  //   if (order) {
  //     order.status = 'delivered';
  //     order.timeline[3].completed = true;
  //     order.timeline[3].time = new Date();
  //     this.updateStats();
  //     this.filterOrders();
  //   }
  // }

  createReturn(orderId: string) {
    // Logic tạo đơn trả hàng
    alert(`Tạo đơn trả hàng cho đơn hàng ${orderId}`);
  }

  viewOrderDetailById(orderId: number) {
    this.mangeOrderService.viewOrderDetailByOrderId(this.orderId).subscribe({
      next: (response) => {
        this.selectedOrder = response.result;
        this.showOrderDetail = true;
      },
      error: (error) => {
        console.error('Error loading order detail:', error);
      }
    });
  }

  closeOrderDetail() {
    this.showOrderDetail = false;
    this.selectedOrder = null;
  }

  printOrder(orderId: string) {
    // Logic in đơn hàng
    alert(`In đơn hàng ${orderId}`);
  }
}

