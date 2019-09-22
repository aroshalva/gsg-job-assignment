import { Injectable } from '@angular/core';
import mockBackend from './_mock-backend'

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor() { }

  register (user) {
    const res = mockBackend.register(user)

    console.log(444444, res)

    return res
  }

  getUsers () {
    return [{ firstName: 'Shalva' }]
  }
}
