import { Injectable } from '@angular/core';
import mockBackend from './_mock-backend'

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor() { }

  register (user) {
    return mockBackend.register(user)
  }

  login (loginInfo) {
    return mockBackend.login(loginInfo)
  }

  getUsers () {
    return [{ firstName: 'Shalva' }]
  }
}
