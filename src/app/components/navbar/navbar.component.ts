import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {timeout} from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  @ViewChild('logoutModal') logoutModal?: ElementRef;
  ngOnInit(): void {
  }
  constructor(private router: Router, private toast: ToastrService) {
  }

  openModal() {
    if (this.logoutModal) {
      const modal = this.logoutModal.nativeElement as HTMLElement;
      modal.classList.add('active');
    }
  }

  confirmLogout(){
    localStorage.removeItem('token');
    this.toast.success('Đăng xuất thành công!', 'Thông báo ', {timeOut : 2000});
    this.router.navigate(['/login']);
    this.declineLogout();
  }

  declineLogout() {
    if (this.logoutModal) {
      const modal = this.logoutModal.nativeElement as HTMLElement;
      modal.classList.remove('active');
    }
  }

}
