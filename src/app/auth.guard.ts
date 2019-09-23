import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserManagementService } from './user-management.service';

@Injectable({ providedIn: 'root' })
class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private _userManagement: UserManagementService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._userManagement.isLoggedIn) {
            return true;
        }

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});

        return false;
    }
}

export default AuthGuard;
