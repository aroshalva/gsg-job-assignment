import Cookies from 'js-cookie';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService } from './user-management.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gsg-job-assignment';

  isLoggedIn: Object;

  constructor(private router: Router, private _userManagement: UserManagementService) {
    this._userManagement.isLoggedInObservable.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnInit() {
  }

  onClickLogout () {
    this._userManagement.logout()
    this.router.navigate(['/login']);
  }
}
