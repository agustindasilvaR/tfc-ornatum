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

logout(): void {
  // Clear the JWT token from local storage
  localStorage.removeItem('token');

  // Redirect the user to the login page
  this.router.navigate(['/login']); // Replace '/login' with the appropriate login page URL
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

  onFileSelected(event: any) {
    this.image_data = event.target.files[0];
  }

  uploadPost() {
    if (!this.user_id || !this.date || !this.image_data) {
      console.error("Please fill in all required fields for the post.");
      return;
    }
  
    const formData = new FormData();
    formData.append('user_id', this.user_id);
    formData.append('date', this.date);
    formData.append('image_data', this.image_data);
  
    // Make a POST request to add the post to the API
    this.http.post<any>('http://127.0.0.1:8000/api/posts', formData).subscribe(
      (postResponse) => {
        console.log("postResponse:", postResponse); // Log the response
        if (postResponse && postResponse.post_id) {
          console.log("Post created successfully!"); // You can show a success message if needed
          const post_id = postResponse.post_id;
          this.addPieces(post_id); // Call a method to add pieces to the post
          this.snackBar.open('Post successfully uploaded!', 'Close', { duration: 5000 })
          this.router.navigate(['/home'])
        } else {
          console.error("Invalid response from the backend:", postResponse);
        }
      },
      (error) => {
        console.error(error);
        // Handle error, show an error message, etc.
      }
    );
  }
  
  addPieces(post_id: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    // Make a POST request to add the pieces
    this.http.post<any>('http://127.0.0.1:8000/api/pieces', JSON.stringify(this.piecesData), { headers }).subscribe(
      (piecesResponse) => {
        console.log('Received piecesResponse:', piecesResponse);

        // Transform the response to match the expected format for insertPostPieceRelationship
        const postPieces = piecesResponse.added_pieces.map((piece: { id: { toString: () => any; }; }) => ({
          post_id: post_id,
          piece_id: piece.id.toString()
        }));

        console.log('Sending transformed postPieces:', postPieces);
        
        this.insertPostPieceRelationship(postPieces);
      },
      (error) => {
        console.error("Failed to add pieces:", error);
        // Handle error, show an error message, etc.
      }
    );
}

  

  insertPostPieceRelationship(postPieces: { post_id: string, piece_id: string }[]) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    console.log('Sending postPieces:', postPieces);
  
    this.http.post<any>('http://127.0.0.1:8000/api/post_pieces', JSON.stringify(postPieces), { headers }).subscribe(
      (postPieceResponse) => {
        console.log("Post-Piece relationships added successfully:", postPieceResponse);
        // Do something with the post-piece relationship response if needed
      },
      (error) => {
        console.error("Failed to add Post-Piece relationships:", error.error); // Print the error message from backend
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
