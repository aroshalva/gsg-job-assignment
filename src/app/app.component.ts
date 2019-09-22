import Cookies from 'js-cookie';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gsg-job-assignment';

  usersFromCookies = []

  ngOnInit() {
    this.loadUsersCookie()
  }

  loadUsersCookie () {
    const uc = Cookies.get('users')

    this.usersFromCookies = uc ? JSON.parse(Cookies.get('users')) : []
  }
}
