import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export interface Stats {
  revenue: number;
  revenueGrowth: number;
  revenueProgress: number;
  orders: number;
  ordersGrowth: number;
  ordersProgress: number;
  users: number;
  usersGrowth: number;
  usersProgress: number;
  products: number;
  productsGrowth: number;
  productsProgress: number;
}

export interface Product {
  name: string;
  category: string;
  sold: number;
  revenue: number;
  rating: number;
  image: string;
}

@Component({
  selector: 'app-dashboard-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss']
})
export class DashboardAnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChild('revenueChart', { static: false }) revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart', { static: false }) categoryChartRef!: ElementRef<HTMLCanvasElement>;

  loading = true;
  selectedPeriod = '30days';
  selectedCategory = 'all';
  startDate: string;
  endDate: string;

  private revenueChart: Chart | null = null;
  private categoryChart: Chart | null = null;

  stats: Stats = {
    revenue: 2547896000,
    revenueGrowth: 15.3,
    revenueProgress: 78,
    orders: 15847,
    ordersGrowth: 12.8,
    ordersProgress: 65,
    users: 8956,
    usersGrowth: 8.7,
    usersProgress: 45,
    products: 1234,
    productsGrowth: 23.5,
    productsProgress: 89
  };

  topProducts: Product[] = [
    {
      name: 'iPhone 15 Pro Max 256GB',
      category: 'Điện tử',
      sold: 2547,
      revenue: 765890000,
      rating: 4.9,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQwKSIvPgo8cGF0aCBkPSJNMjUgMTVMMzAgMjVIMjBMMjUgMTVaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDAiIHgxPSIwIiB5MT0iMCIgeDI9IjUwIiB5Mj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzY2N2VlYSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K'
    },
    {
      name: 'Áo thun Uniqlo nam',
      category: 'Thời trang',
      sold: 5896,
      revenue: 147400000,
      rating: 4.7,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQxKSIvPgo8cGF0aCBkPSJNMTUgMjBIMzVWMzVIMTVWMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDEiIHgxPSIwIiB5MT0iMCIgeDI9IjUwIiB5Mj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI2YwOTNmYiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmNTU3NmMiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K'
    },
    {
      name: 'Son môi MAC Ruby Woo',
      category: 'Làm đẹp',
      sold: 3247,
      revenue: 97410000,
      rating: 4.8,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQyKSIvPgo8Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDIiIHgxPSIwIiB5MT0iMCIgeDI9IjUwIiB5Mj0iNTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzRmYWNmZSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMGYyZmUiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K'
    },
    {
      name: 'Ghế gaming DXRacer',
      category: 'Nhà cửa',
      sold: 856,
      revenue: 342400000,
      rating: 4.6,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQzKSIvPgo8cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQzIiB4MT0iMCIgeTE9IjAiIHgyPSI1MCIgeTI9IjUwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM0M2U5N2IiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzhmOWQ3Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=='
    },
    {
      name: 'Laptop Dell XPS 13',
      category: 'Điện tử',
      sold: 1247,
      revenue: 436450000,
      rating: 4.9,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQ0KSIvPgo8cmVjdCB4PSIxMCIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIyMCIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQ0IiB4MT0iMCIgeTE9IjAiIHgyPSI1MCIgeTI9IjUwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM2NjdlZWEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzY0YmEyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=='
    }
  ];

  constructor() {
    // Initialize dates
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
    this.endDate = now.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Simulate initial loading
    setTimeout(() => {
      this.loading = false;
    }, 1000); // Giả lập thời gian tải 1 giây
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    if (!this.revenueChartRef || !this.categoryChartRef) {
      console.warn('Chart references are not available yet.');
      return;
    }

    if (this.revenueChart) this.revenueChart.destroy();
    if (this.categoryChart) this.categoryChart.destroy();

    // Dữ liệu mẫu cho biểu đồ doanh thu
    const revenueData = {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      datasets: [{
        label: 'Doanh thu (VND)',
        data: [500000000, 600000000, 700000000, 747896000], // Dữ liệu mẫu
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.4
      }]
    };

    // Khởi tạo biểu đồ doanh thu
    this.revenueChart = new Chart(this.revenueChartRef.nativeElement, {
      type: 'line',
      data: revenueData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (value) => `${Number(value) / 1000000}M VND` }
          }
        }
      }
    });

    // Dữ liệu mẫu cho biểu đồ danh mục
    const categoryData = {
      labels: ['Điện tử', 'Thời trang', 'Làm đẹp', 'Nhà cửa'],
      datasets: [{
        label: 'Sản phẩm bán ra',
        data: [2547, 5896, 3247, 856], // Dữ liệu từ topProducts
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
        borderWidth: 1
      }]
    };

    // Khởi tạo biểu đồ danh mục
    this.categoryChart = new Chart(this.categoryChartRef.nativeElement, {
      type: 'pie',
      data: categoryData,
      options: {
        responsive: true
      }
    });
  }

  updateData(): void {
    this.loading = true;
    // Giả lập cập nhật dữ liệu dựa trên bộ lọc
    setTimeout(() => {
      // Logic cập nhật stats và topProducts dựa trên selectedPeriod, selectedCategory, startDate, endDate
      this.stats = {
        revenue: this.generateRandomRevenue(),
        revenueGrowth: this.generateRandomGrowth(),
        revenueProgress: this.generateRandomProgress(),
        orders: this.generateRandomNumber(10000, 20000),
        ordersGrowth: this.generateRandomGrowth(),
        ordersProgress: this.generateRandomProgress(),
        users: this.generateRandomNumber(5000, 10000),
        usersGrowth: this.generateRandomGrowth(),
        usersProgress: this.generateRandomProgress(),
        products: this.generateRandomNumber(1000, 2000),
        productsGrowth: this.generateRandomGrowth(),
        productsProgress: this.generateRandomProgress()
      };

      // Cập nhật topProducts (giả lập)
      this.topProducts = this.topProducts.map(product => ({
        ...product,
        sold: this.generateRandomNumber(500, 6000),
        revenue: this.generateRandomRevenue()
      }));

      this.loading = false;
      this.initializeCharts(); // Cập nhật lại biểu đồ
    }, 1000);
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0); // Tạo mảng sao dựa trên rating
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateRandomRevenue(): number {
    return this.generateRandomNumber(100000000, 3000000000); // Doanh thu ngẫu nhiên từ 100M đến 3T VND
  }

  private generateRandomGrowth(): number {
    return Number((Math.random() * 20).toFixed(1)); // Tăng trưởng ngẫu nhiên từ 0% đến 20%
  }

  private generateRandomProgress(): number {
    return Math.floor(Math.random() * 100); // Tiến độ ngẫu nhiên từ 0% đến 100%
  }
}
