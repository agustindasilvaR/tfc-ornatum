import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-form-component',
  templateUrl: './post-form-component.component.html',
  styleUrls: ['./post-form-component.component.css']
})

export class PostFormComponentComponent implements OnInit {
  user_id: string | undefined;
  date: string | undefined;
  image_data: File | undefined;
  piecesData: any[] = [];

  ngOnInit() {
    // Initialize the piecesData array with 5 empty objects
    this.addPieceInput();
  }

  constructor(private http: HttpClient) {}

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
        console.log("Pieces added successfully:", piecesResponse);
        this.insertPostPieceRelationship(piecesResponse);
      },
      (error) => {
        console.error("Failed to add pieces:", error);
        // Handle error, show an error message, etc.
      }
    );
  }
  

  insertPostPieceRelationship(postPieces: { post_id: string, piece_id: string }[]) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    this.http.post<any>('http://127.0.0.1:8000/api/post_pieces', JSON.stringify(postPieces), { headers }).subscribe(
      (postPieceResponse) => {
        console.log("Post-Piece relationships added successfully:", postPieceResponse);
        // Do something with the post-piece relationship response if needed
      },
      (error) => {
        console.error("Failed to add Post-Piece relationships:", error);
        // Handle error, show an error message, etc.
      }
    );
  }
  
  
  
  addPieceInput() {
    this.piecesData.push({ brand: '', model: '', category_id: '' });
  }


  
}
