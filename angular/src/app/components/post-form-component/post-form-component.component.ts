import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-post-form-component',
  templateUrl: './post-form-component.component.html',
  styleUrls: ['./post-form-component.component.css']
})

export class PostFormComponentComponent implements OnInit {
  user_id: string | undefined;
  date: string | undefined;
  username: string = "";
  image_data: File | undefined;
  maxPieces = 5;
  piecesData: any[] = [];

  ngOnInit() {
    this.getUserName();
    this.addPieceInput();
    this.user_id = this.getUserId()
    this.date = this.getCurrentDate()
  }

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  getUserId() {
    const token = localStorage.getItem('token')

        const jwtHelper = new JwtHelperService();

        if (token !== null) {
          const decodedToken = jwtHelper.decodeToken(token);
          const storedId = decodedToken.id
          return storedId
  }
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

logout(): void {

  localStorage.removeItem('token');

  this.router.navigate(['/login']);
}

  getCurrentDate() {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    return formattedDate
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

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement | null;  // Add the | null type
    
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
        this.image_data = fileInput.files[0];
        
        const fileName = fileInput.files[0].name;
        const extension = fileName.split('.').pop()?.toLowerCase();
        
        if (!extension) {
            return;
        }

        if (['png', 'jpeg', 'jpg'].includes(extension)) {

        } else {
          this.snackBar.open('File type not valid.', 'Close', { duration: 5000 })
          this.clearFileInput(fileInput);
        }
    }
}

  clearFileInput(fileInput: HTMLInputElement) {
    fileInput.value = '';
}

  

  uploadPost() {
    if (!this.user_id || !this.image_data) {
      this.snackBar.open('Please fill all the required fields.', 'Close', {
        duration: 5000 
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('user_id', this.user_id);
    formData.append('image_data', this.image_data);
  
    this.http.post<any>('http://127.0.0.1:8000/api/posts', formData).subscribe(
      (postResponse) => {
        if (postResponse && postResponse.post_id) { 
          const post_id = postResponse.post_id;
          this.addPieces(post_id); 
          this.snackBar.open('Post successfully uploaded!', 'Close', { duration: 5000 })
          this.router.navigate(['/home'])
        } else {
          this.snackBar.open('Error while uploading.', 'Close', {
            duration: 5000 
          });
        }
      }
    );
  }
  
  addPieces(post_id: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  

    this.http.post<any>('http://127.0.0.1:8000/api/pieces', JSON.stringify(this.piecesData), { headers }).subscribe(
      (piecesResponse) => {

        const postPieces = piecesResponse.added_pieces.map((piece: { id: { toString: () => any; }; }) => ({
          post_id: post_id,
          piece_id: piece.id.toString()
        }));
        
        this.insertPostPieceRelationship(postPieces);
      }
    );
}

  

  insertPostPieceRelationship(postPieces: { post_id: string, piece_id: string }[]) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    this.http.post<any>('http://127.0.0.1:8000/api/post_pieces', JSON.stringify(postPieces), { headers }).subscribe(
      (postPieceResponse) => {
      }
    );
}

  
  
  
  addPieceInput() {
    if (this.piecesData.length < this.maxPieces) {
      this.piecesData.push({ brand: '', model: '' });
    } else {
      this.snackBar.open('Limit of pieces per post reached.', 'Close', { duration: 5000 });
    }
  }

  deletePieceInput() {
    if(this.piecesData.length > 1) {
      this.piecesData.pop()
    } else {
      this.snackBar.open('You must have a minimum of one piece per post.', 'Close', { duration: 5000 });
    }
  }


  
}
