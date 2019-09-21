import { Injectable } from '@angular/core';
import mockBackend from './_mock-backend'

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor() { }

  register (user) {
    console.log(mockBackend)

    return mockBackend.register(user)
  }

  getUsers () {
    return [{ firstName: 'Shalva' }]
  }
}
