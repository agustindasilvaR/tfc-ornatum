import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.css']
})
export class ProfileComponentComponent implements OnInit {

  images: string[] | undefined;
  user_id: any;

  constructor(private http:HttpClient, private sanitizer:DomSanitizer, private router:Router) { }

  async ngOnInit(): Promise<void> {
    this.checkToken()
    await this.evaluateUser(); // Wait for evaluateUser() to complete
    this.getPostingsByUserId(this.user_id); // Call getPostingsByUserId() after evaluateUser() is done
  }

  getPostingImages(): void {
    const url = 'http://127.0.0.1:8000/postings/images';

    this.http.get(url).subscribe((response: any) => {
      this.images = response.images.map((image: string) =>
        this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + image)
      );
    });
  }

  getPostingsByUserId(user_id: string): void {
    const url = `http://127.0.01.:8000/users/${user_id}/postings`;
    this.http.get(url).subscribe((response: any) => {
      this.images = response.images.map((image: string) =>
        this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + image)
      );
    });
  }

  evaluateUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = 'http://127.0.0.1:8000/api/users/list';

      this.http.get(url).subscribe(
        (response: any) => {
          const userIds = response.map((user: any) => user.id);
          console.log('User IDs:', userIds);

          const token = localStorage.getItem('token');

          if (token !== null) {
            const jwtHelper = new JwtHelperService();
            const decodedToken = jwtHelper.decodeToken(token);
            const storedId = decodedToken.id;
            this.user_id = storedId
            console.log(storedId);

            // Check if the storedId exists and is present in the userIds array
            if (userIds.includes(storedId)) {
              resolve(storedId); // Resolve the promise with the user ID
            } else {
              reject('User ID not found in the list.'); // Reject the promise if user ID not found
            }
          } else {
            reject('Token not found.'); // Reject the promise if token is null
          }
        },
        (error: any) => {
          console.error('Error getting user list:', error);
          reject(error); // Reject the promise on HTTP request error
        }
      );
    });
  }

  checkToken(): void {
    if(!localStorage.getItem('token')) { 
      this.router.navigateByUrl('/login')
  }
  }

}
