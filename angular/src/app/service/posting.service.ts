import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Posting } from "../models/Posting";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    private httpHeaders:HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
    
    URL:string = "http://127.0.0.1:8000/api"

    constructor(private http:HttpClient) {

    }

    getPostings() : Observable<Posting>{
        return this.http.post<Posting>(this.URL+"/posts", {headers: this.httpHeaders})
    }

    getPostingsForUser(user_id: string): Observable<any[]> {
        const url = `${this.URL}/users/${user_id}/postings`;
        return this.http.get<any[]>(url);
    }
}