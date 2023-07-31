import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  registerUser(userData: any) {
    return this.http.post('/api/users/add', userData);
  }
}
