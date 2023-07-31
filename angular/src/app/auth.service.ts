import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInFlag: boolean = false;

  login(username: string, password: string): boolean {
    // Implement your authentication logic here
    // Set the isLoggedInFlag based on successful authentication
    // You may store authentication tokens or user details in local storage or a cookie

    return this.isLoggedInFlag;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInFlag;
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedInFlag = value;
  }
}
