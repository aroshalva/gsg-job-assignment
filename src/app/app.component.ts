import Cookies from 'js-cookie';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService } from './user-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gsg-job-assignment';

  isLoggedIn: Object;

  constructor(private router: Router, private _userManagement: UserManagementService, private toastr: ToastrService) {
    this._userManagement.isLoggedInObservable.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnInit() {
    setInterval(() => {
      this.toastr.success('Hello world!', 'Toastr fun!');
    }, 3000)
  }

  onClickLogout () {
    this._userManagement.logout()
    this.router.navigate(['/login']);
  }
}
