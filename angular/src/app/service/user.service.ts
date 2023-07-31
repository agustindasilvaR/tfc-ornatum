import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/User";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private httpHeaders:HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
    
    URL:string = "http://127.0.0.1:8000/api"
    loginURL:string = "http://127.0.0.1:8000/login"

    constructor(private http:HttpClient) {

    }

    saveUser(user:User) : Observable<User>{
        return this.http.post<User>(this.URL+"/users/add", user, {headers: this.httpHeaders})
    }

    login(username: string, password: string) {
        const data = {
        username: username,
        password: password
        };
    
        return this.http.post(this.loginURL, data);
    }

}