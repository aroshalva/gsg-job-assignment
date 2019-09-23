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
  user: FormGroup;

  constructor(private _userManagement: UserManagementService) {
    this._userManagement.isLoggedInObservable.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const userToLoad = this._userManagement.getCurrentUser()

        this.user = new FormGroup({
          email: new FormControl(userToLoad.email || '', [Validators.required, Validators.email]),
          password: new FormControl(userToLoad.password || '', [Validators.required]),
          repeatedPassword: new FormControl(userToLoad.repeatedPassword || '', [this.requiredIf, this.repeatedIsEqaulToPassword]),
          firstName: new FormControl(userToLoad.firstName || '', [Validators.required]),
          lastName: new FormControl(userToLoad.lastName || '', [Validators.required]),
          phoneNumber: new FormControl(userToLoad.phoneNumber || '', [this.phoneNumberValidation]),
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
      // this.router.navigate(['/login']);
    }
  }
}
