import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private _userManagement: UserManagementService) { }

  ngOnInit() {
  }

}
