import { Component, OnInit } from '@angular/core';
import Cookies from 'js-cookie'
import get from 'lodash/get';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagementService } from '../user-management.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  lodGet = get;
  loginInfo: FormGroup;

  constructor(private router: Router, private _userManagement: UserManagementService) {
    this.loginInfo = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    setInterval(() => {
      console.log(666, this.loginInfo)
    }, 4000)
  }

  onSubmit () {
    Object.values(this.loginInfo.controls).forEach(val => { val.markAsTouched({ onlySelf: true }) })


    const loginResponse:any = this._userManagement.login({
      email: this.loginInfo.controls.email.value,
      password: this.loginInfo.controls.password.value,
    });

    if (loginResponse.error) {
      Object.keys(this.loginInfo.controls).forEach(key => {
        const formControlErrorCode = loginResponse.error[key]

        if (formControlErrorCode) {
          this.loginInfo.controls[key].setErrors({ [formControlErrorCode]: true })
        }
      })
    } else {
      Cookies.set('token', loginResponse.token)

      this.router.navigate(['/']);
    }
  }
}
