import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

interface OrderItem {
  id: number;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderTimeline {
  title: string;
  time?: Date;
  completed: boolean;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  createdDate: Date;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  timeline: OrderTimeline[];
}


@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss'
})


export class ManageOrderComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'all';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Modal
  showOrderDetail: boolean = false;
  selectedOrder: Order | null = null;

  // Stats
  totalOrders: number = 0;
  pendingOrders: number = 0;
  completedOrders: number = 0;

  ngOnInit() {
    this.loadOrders();
    this.updateStats();
  }

  loadOrders() {
    // Mock data - thay thế bằng service call thực tế
    this.orders = [
      {
        id: 'ORD001',
        customerName: 'Nguyễn Văn An',
        customerPhone: '0901234567',
        customerEmail: 'an.nguyen@email.com',
        shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
        createdDate: new Date('2024-01-15T10:30:00'),
        status: 'pending',
        items: [
          {
            id: 1,
            name: 'Áo thun nam cotton',
            variant: 'Màu đen, Size M',
            price: 150000,
            quantity: 2,
            image: 'https://via.placeholder.com/60x60'
          },
          {
            id: 2,
            name: 'Quần jeans',
            variant: 'Màu xanh, Size 30',
            price: 300000,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60'
          }
        ],
        subtotal: 600000,
        shippingFee: 30000,
        discount: 50000,
        total: 580000,
        timeline: [
          { title: 'Đặt hàng thành công', time: new Date('2024-01-15T10:30:00'), completed: true },
          { title: 'Xác nhận đơn hàng', completed: false },
          { title: 'Đang giao hàng', completed: false },
          { title: 'Giao hàng thành công', completed: false }
        ]
      },
      {
        id: 'ORD002',
        customerName: 'Trần Thị Bình',
        customerPhone: '0907654321',
        customerEmail: 'binh.tran@email.com',
        shippingAddress: '456 Đường XYZ, Quận 3, TP.HCM',
        createdDate: new Date('2024-01-14T14:20:00'),
        status: 'confirmed',
        items: [
          {
            id: 3,
            name: 'Váy maxi',
            variant: 'Màu hồng, Size S',
            price: 250000,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60'
          }
        ],
        subtotal: 250000,
        shippingFee: 25000,
        discount: 0,
        total: 275000,
        timeline: [
          { title: 'Đặt hàng thành công', time: new Date('2024-01-14T14:20:00'), completed: true },
          { title: 'Xác nhận đơn hàng', time: new Date('2024-01-14T15:00:00'), completed: true },
          { title: 'Đang giao hàng', completed: false },
          { title: 'Giao hàng thành công', completed: false }
        ]
      },
      {
        id: 'ORD003',
        customerName: 'Lê Văn Cường',
        customerPhone: '0909876543',
        customerEmail: 'cuong.le@email.com',
        shippingAddress: '789 Đường DEF, Quận 7, TP.HCM',
        createdDate: new Date('2024-01-13T09:15:00'),
        status: 'shipping',
        items: [
          {
            id: 4,
            name: 'Giày sneaker',
            variant: 'Màu trắng, Size 42',
            price: 500000,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60'
          },
          {
            id: 5,
            name: 'Tất nam',
            variant: 'Màu đen, Size M',
            price: 50000,
            quantity: 3,
            image: 'https://via.placeholder.com/60x60'
          }
        ],
        subtotal: 650000,
        shippingFee: 35000,
        discount: 65000,
        total: 620000,
        timeline: [
          { title: 'Đặt hàng thành công', time: new Date('2024-01-13T09:15:00'), completed: true },
          { title: 'Xác nhận đơn hàng', time: new Date('2024-01-13T10:00:00'), completed: true },
          { title: 'Đang giao hàng', time: new Date('2024-01-14T08:00:00'), completed: true },
          { title: 'Giao hàng thành công', completed: false }
        ]
      },
      {
        id: 'ORD004',
        customerName: 'Phạm Thị Dung',
        customerPhone: '0905432178',
        customerEmail: 'dung.pham@email.com',
        shippingAddress: '321 Đường GHI, Quận 2, TP.HCM',
        createdDate: new Date('2024-01-12T16:45:00'),
        status: 'delivered',
        items: [
          {
            id: 6,
            name: 'Túi xách nữ',
            variant: 'Màu đỏ',
            price: 400000,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60'
          }
        ],
        subtotal: 400000,
        shippingFee: 30000,
        discount: 40000,
        total: 390000,
        timeline: [
          { title: 'Đặt hàng thành công', time: new Date('2024-01-12T16:45:00'), completed: true },
          { title: 'Xác nhận đơn hàng', time: new Date('2024-01-12T17:00:00'), completed: true },
          { title: 'Đang giao hàng', time: new Date('2024-01-13T08:00:00'), completed: true },
          { title: 'Giao hàng thành công', time: new Date('2024-01-14T10:30:00'), completed: true }
        ]
      },
      {
        id: 'ORD005',
        customerName: 'Hoàng Văn Em',
        customerPhone: '0908765432',
        customerEmail: 'em.hoang@email.com',
        shippingAddress: '654 Đường JKL, Quận 10, TP.HCM',
        createdDate: new Date('2024-01-11T11:20:00'),
        status: 'cancelled',
        items: [
          {
            id: 7,
            name: 'Áo khoác',
            variant: 'Màu xanh, Size L',
            price: 350000,
            quantity: 1,
            image: 'https://via.placeholder.com/60x60'
          }
        ],
        subtotal: 350000,
        shippingFee: 30000,
        discount: 0,
        total: 380000,
        timeline: [
          { title: 'Đặt hàng thành công', time: new Date('2024-01-11T11:20:00'), completed: true },
          { title: 'Đơn hàng bị hủy', time: new Date('2024-01-11T14:00:00'), completed: true }
        ]
      }
    ];

    this.filterOrders();
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
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerPhone.includes(searchLower)
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

  getOrdersByStatus(status: string): Order[] {
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
  confirmOrder(orderId: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'confirmed';
      order.timeline[1].completed = true;
      order.timeline[1].time = new Date();
      this.updateStats();
      this.filterOrders();
    }
  }

  cancelOrder(orderId: string) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'cancelled';
        order.timeline = [
          ...order.timeline.slice(0, 1),
          { title: 'Đơn hàng bị hủy', time: new Date(), completed: true }
        ];
        this.updateStats();
        this.filterOrders();
      }
    }
  }

  startShipping(orderId: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'shipping';
      order.timeline[2].completed = true;
      order.timeline[2].time = new Date();
      this.updateStats();
      this.filterOrders();
    }
  }

  completeOrder(orderId: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'delivered';
      order.timeline[3].completed = true;
      order.timeline[3].time = new Date();
      this.updateStats();
      this.filterOrders();
    }
  }

  createReturn(orderId: string) {
    // Logic tạo đơn trả hàng
    alert(`Tạo đơn trả hàng cho đơn hàng ${orderId}`);
  }

  viewOrderDetail(orderId: string) {
    this.selectedOrder = this.orders.find(o => o.id === orderId) || null;
    this.showOrderDetail = true;
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

