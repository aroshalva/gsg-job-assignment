import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UserManagementService } from '../user-management.service'


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  user: FormGroup;

  constructor(private _userManagement: UserManagementService) {
    this.user = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      repeatedPassword: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      phoneNumber: new FormControl(),
    })
  }

  ngOnInit() {
  }

  onSubmit () {
    console.log(777)

    this._userManagement.register({
      email: this.user.controls.email.value,
      password: this.user.controls.password.value,
      repeatedPassword: this.user.controls.repeatedPassword.value,
      firstName: this.user.controls.firstName.value,
      lastName: this.user.controls.lastName.value,
      phoneNumber: this.user.controls.phoneNumber.value,
    });
  }

}
