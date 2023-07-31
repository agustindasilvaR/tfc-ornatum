import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { PostService } from 'src/app/service/posting.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  images: string[] | undefined;
  username: string = "";
  ids: number[] | undefined;
  postings: any[] = [];

  constructor(private postService: PostService, private http: HttpClient, private sanitizer:DomSanitizer, private router:Router) { }

  ngOnInit(): void {
    this.checkToken()
    this.getPostingImages();
    this.getUsers();
    this.getUserName()
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

    this.http.get(url).subscribe(
      (response: any) => {
        const postIds = response.map((post: any) => post.user_id);
        console.log('Post IDs:', postIds);
        
        const token = localStorage.getItem('token')

        const jwtHelper = new JwtHelperService();

        if (token !== null) {
          const decodedToken = jwtHelper.decodeToken(token);
          const storedId = decodedToken.id
          console.log(decodedToken.id)
                  // Check if the storedId exists and is present in the postIds array
        if (storedId && postIds.includes(parseInt(storedId))) {
          this.router.navigateByUrl('/profile');
        }
        } else {
          // Handle the case where the token is null
        }


      },
      (error: any) => {
        console.error('Error getting post_list:', error);
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
                  // Check if the storedId exists and is present in the postIds array
        if (storedId && userIds.includes(parseInt(storedId))) {
          this.router.navigateByUrl('/profile');
        }
        } else {
          // Handle the case where the token is null
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
      this.username = storedName
    }
  }


getUsers(): void {
  const url = 'http://127.0.0.1:8000/api/users/list';

  this.http.get(url).subscribe(
    (response: any) => {
      // Process the user data here
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
  // Clear the JWT token from local storage
  localStorage.removeItem('token');

  // Redirect the user to the login page
  this.router.navigate(['/login']); // Replace '/login' with the appropriate login page URL
}

checkToken(): void {
  if(!localStorage.getItem('token')) { 
    this.router.navigateByUrl('/login')
}
}
}
