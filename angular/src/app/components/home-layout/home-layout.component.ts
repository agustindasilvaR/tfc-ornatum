import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { PostService } from 'src/app/service/posting.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponentComponent } from '../profile-component/profile-component.component';
import { PopupComponentComponent } from '../popup-component/popup-component.component';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
}) 
export class HomeLayoutComponent implements OnInit {
  images: string[] | undefined;
  username: string = "";
  ids: number[] | undefined;
  postId: number = 0;
  pieces: any[] = [];
  postings: any[] = [];

  constructor(private postService: PostService, private http: HttpClient, private sanitizer:DomSanitizer, private router:Router, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.checkToken()
    this.getPostingImages();
    this.getUserName();
    this.getPosts();
  }

  getPostingImages(): void {
    const url = 'http://127.0.0.1:8000/postings/images';

    this.http.get(url).subscribe((response: any) => {
      this.images = response.images.map((image: string) =>
        this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + image)
      );
    });
    console.log(this.images)
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

  onImageClick(postId: number): void {
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
  

  evaluateUser(): void {
    const url = 'http://127.0.0.1:8000/api/users/list';

    this.http.get(url).subscribe(
      (response: any) => {
        const userIds = response.map((user: any) => user.id);
        console.log('User IDs:', userIds);
        
        const token = localStorage.getItem('token')

        const jwtHelper = new JwtHelperService();

        if (token !== null) {
          const decodedToken = jwtHelper.decodeToken(token);
          const storedId = decodedToken.id
          console.log(decodedToken.id)
        if (storedId && userIds.includes(parseInt(storedId))) {
          this.router.navigateByUrl('/profile');
        }
        } else {
        }


      },
      (error: any) => {
        console.error('Error getting post_list:', error);
      }
    );
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


getUsers(): void {
  const url = 'http://127.0.0.1:8000/api/users/list';

  this.http.get(url).subscribe(
    (response: any) => {
      console.log('User data:', response);
    },
    (error: any) => {
      console.error('Error getting user data:', error);
    }
  );
}



printId(id: number): void {
  console.log('Clicked on posting ID:', id);
}

logout(): void {

  localStorage.removeItem('token');

  this.router.navigate(['/login']); 
}

checkToken(): void {
  if(!localStorage.getItem('token')) { 
    this.router.navigateByUrl('/login')
}
}
}
