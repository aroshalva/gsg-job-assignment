import { Component, OnInit, Input } from '@angular/core';
import get from 'lodash/get';
import  forEach from 'lodash/forEach';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserManagementService } from '../user-management.service'
import helpers from '../_helpers'


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  lodGet = get;
  user: FormGroup;
  passwordVisible: boolean = false;

  constructor(private router: Router, private _userManagement: UserManagementService) {
    if (this._userManagement.isLoggedIn) {
      this.router.navigate(['/']);
    }

    this.user = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      repeatedPassword: new FormControl('', [this.requiredIf, this.repeatedIsEqaulToPassword]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [this.phoneNumberValidation]),
    })
  }

  ngOnInit() {}

  onChangePassword () {
    this.user.controls.repeatedPassword.updateValueAndValidity({ onlySelf: true, emitEvent: false })
  }

  phoneNumberValidation (control: AbstractControl): {[key: string]: any} | null {
    return (control.value && !helpers.isPhoneNumberValid(control.value)) ? { 'invalid': true } : null;
  }

  requiredIf (control: AbstractControl): {[key: string]: any} | null {
    return (control.parent && control.parent.get('password').value && !control.value) ? { 'requiredIf': true } : null;
  }

  repeatedIsEqaulToPassword (control: AbstractControl): {[key: string]: any} | null {
    return (
      control.parent
      && control.value
      && (control.value !== control.parent.get('password').value)
    ) ? { 'isNotEqualToPassword': true } : null;
  }

  onSubmit () {
    forEach(this.user.controls, val => { val.markAsTouched({ onlySelf: true }) })

    const registerResponse:any = this._userManagement.register({
      email: this.user.controls.email.value,
      password: this.user.controls.password.value,
      repeatedPassword: this.user.controls.repeatedPassword.value,
      firstName: this.user.controls.firstName.value,
      lastName: this.user.controls.lastName.value,
      phoneNumber: this.user.controls.phoneNumber.value,
    });

    if (registerResponse.error) {
      forEach(registerResponse.error, (value, key) => {
        this.user.controls[key].setErrors({ [value]: true })
      })
    } else {
      this.router.navigate(['/login']);
    }
  }
}
