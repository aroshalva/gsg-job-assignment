import { Component, OnInit } from '@angular/core';
import get from 'lodash/get';
import  forEach from 'lodash/forEach';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';

import { UserManagementService } from '../user-management.service'
import helpers from '../_helpers'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  lodGet = get;
  userFromService: any;
  user: FormGroup;
  editOn: boolean = false;

  constructor(private _userManagement: UserManagementService) {
    this._userManagement.isLoggedInObservable.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userFromService = this._userManagement.getCurrentUser()

        this.user = new FormGroup({
          email: new FormControl(this.userFromService.email || '', [Validators.required, Validators.email]),
          password: new FormControl(this.userFromService.password || '', [Validators.required]),
          firstName: new FormControl(this.userFromService.firstName || '', [Validators.required]),
          lastName: new FormControl(this.userFromService.lastName || '', [Validators.required]),
          phoneNumber: new FormControl(this.userFromService.phoneNumber || '', [this.phoneNumberValidation]),
        })
      } else {
        this.user = null
      }
    });
  }

  ngOnInit() {}

  phoneNumberValidation (control: AbstractControl): {[key: string]: any} | null {
    return (control.value && !helpers.isPhoneNumberValid(control.value)) ? { 'invalid': true } : null;
  }

  onClickEdit () {
    if (this.editOn) {
      this.user.controls.email.setValue(this.userFromService.email)
      this.user.controls.password.setValue(this.userFromService.password)
      this.user.controls.firstName.setValue(this.userFromService.firstName)
      this.user.controls.lastName.setValue(this.userFromService.lastName)
      this.user.controls.phoneNumber.setValue(this.userFromService.phoneNumber)
    }

    this.editOn = !this.editOn
  }

  onSubmit () {
    forEach(this.user.controls, val => { val.markAsTouched({ onlySelf: true }) })

    const registerResponse:any = this._userManagement.editCurrentUser({
      id: this.userFromService.id,
      email: this.user.controls.email.value,
      firstName: this.user.controls.firstName.value,
      lastName: this.user.controls.lastName.value,
      phoneNumber: this.user.controls.phoneNumber.value,
    });

    if (registerResponse.error) {
      forEach(registerResponse.error, (value, key) => {
        this.user.controls[key].setErrors({ [value]: true })
      })
    } else {
      this.userFromService = this._userManagement.getCurrentUser();

      this.editOn = false;
    }
  }
}
