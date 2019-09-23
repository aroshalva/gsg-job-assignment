import Cookies from 'js-cookie';
import { Component } from '@angular/core';
import { UserManagementService } from './user-management.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gsg-job-assignment';

  currentUser: Object;

  constructor(private _userManagement: UserManagementService) {
    this._userManagement.isLoggedInObservable.subscribe(isLoggedIn => {
      console.log('app subscribe isLoggedIn: ', isLoggedIn)

      if (isLoggedIn) {
        this.currentUser = this._userManagement.getCurrentUser()
      }
    });
  }

  ngOnInit() {
  }
}
