import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { PostService } from 'src/app/service/posting.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponentComponent } from '../popup-component/popup-component.component';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
}) 
export class HomeComponentComponent implements OnInit {
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
      }
    );
  }
  

  evaluateUser(): void {
    const url = 'http://127.0.0.1:8000/api/users/list';

    this.http.get(url).subscribe(
      (response: any) => {
        const userIds = response.map((user: any) => user.id);
        
        const token = localStorage.getItem('token')

        const jwtHelper = new JwtHelperService();

        if (token !== null) {
          const decodedToken = jwtHelper.decodeToken(token);
          const storedId = decodedToken.id

        if (storedId && userIds.includes(parseInt(storedId))) {
          this.router.navigateByUrl('/profile');
        }
        } else {
        }


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
    }
  );
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
