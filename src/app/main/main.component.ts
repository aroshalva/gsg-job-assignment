import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  currentUser: Object;

  constructor(private _userManagement: UserManagementService) {
    this._userManagement.isLoggedInObservable.subscribe(isLoggedIn => {
      console.log('main subscribe isLoggedIn: ', isLoggedIn)

      if (isLoggedIn) {
        this.currentUser = this._userManagement.getCurrentUser()
      } else {
        this.currentUser = null
      }
    });
  }

  ngOnInit() {
  }

}
