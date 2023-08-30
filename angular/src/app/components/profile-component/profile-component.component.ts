import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { PopupComponentComponent } from '../popup-component/popup-component.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.css']
})
export class ProfileComponentComponent implements OnInit {

  images: string[] | undefined;
  user_id: any;
  username: string = "";
  ids: number[] | undefined;
  pieces: any[] = [];
  postings: any[] = [];
  postId: number = 0;

  constructor(private http:HttpClient, private sanitizer:DomSanitizer, private router:Router, private dialog:MatDialog) { }

  async ngOnInit(): Promise<void> {
    this.checkToken()
    await this.evaluateUser(); // Wait for evaluateUser() to complete
    this.getUserName()
    this.getPostingsByUserId(this.user_id);
  }

  getPostingImages(): void {
    const url = 'http://127.0.0.1:8000/postings/images';

    this.http.get(url).subscribe((response: any) => {
      this.images = response.images.map((image: string) =>
        this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + image)
      );
    });
  }

  getUserName(): void {
    const token = localStorage.getItem('token')

    const jwtHelper = new JwtHelperService();

    if (token !== null) {
      const decodedToken = jwtHelper.decodeToken(token);
      const storedName = decodedToken.username
      this.username = storedName.toUpperCase()
    }
  }

  getPostingsByUserId(user_id: string): void {
    const url = `http://127.0.01.:8000/users/${user_id}/postings`;
    this.http.get<any[]>(url).subscribe((response: any[]) => {
      this.postings = response.map((post) => ({
        id: post.id,
        image_data: this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + post.image_data),
      }));
    });
  }

  getPosts(): void {
    const url = 'http://127.0.0.1:8000/api/posts';

    this.http.get<any[]>(url).subscribe((response: any[]) => {
      this.postings = response.map((post) => ({
        id: post.id,
        image_data: this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + post.image_data),
      }));
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

  onImageClick(postId: number): void {
    console.log(this.postings)
    const url = `http://127.0.0.1:8000/api/posts/${postId}/pieces`;
  
    this.http.get<any[]>(url).subscribe(
      (pieces: any[]) => {
        this.pieces = pieces;
        
        const clickedImage = this.postings.find((post) => post.id === postId);
        this.dialog.open(PopupComponentComponent, {
          data: { id: clickedImage.id, imageData: clickedImage.image_data, pieces: this.pieces },
          width: '1200px',
          height: '800px',
        });
        console.log(this.pieces)
      },
      (error: any) => {
        console.error('Error fetching post pieces:', error);
      }
    );
  }

  checkToken(): void {
    if(!localStorage.getItem('token')) { 
      this.router.navigateByUrl('/login')
  }
  }

  logout(): void {
    // Clear the JWT token from local storage
    localStorage.removeItem('token');
  
    // Redirect the user to the login page
    this.router.navigate(['/login']); // Replace '/login' with the appropriate login page URL
  }

}
