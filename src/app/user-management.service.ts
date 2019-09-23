import { Injectable } from '@angular/core';
import Cookies from 'js-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import mockBackend from './_mock-backend';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private token = Cookies.get('token');
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedInObservable: Observable<boolean>;

  constructor() {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!this.token);
    this.isLoggedInObservable = this.isLoggedInSubject.asObservable();
  }

  public get isLoggedIn(): boolean {
    return !!this.isLoggedInSubject.value;
  }

  register (user) {
    return mockBackend.register(user)
  }

  login (loginInfo) {
    const result:any = mockBackend.login(loginInfo)

    if (result && !result.error) {
      Cookies.set('token', result.token)

      this.token = result.token

      this.isLoggedInSubject.next(true);
    }

    return result
  }

  logout () {
    const result:any = mockBackend.logout(this.token)

    if (result && !result.error) {
      Cookies.remove('token')

      this.token = null

      this.isLoggedInSubject.next(false);
    }

    return result
  }

  getCurrentUser () {
    return mockBackend.getUser(this.token);
  }

  editCurrentUser (newUser) {
    return mockBackend.editUser({ newUser, token: this.token });
  }
}
