import { HttpClient } from '@angular/common/http';
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
  pieces: any[] = [];

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
  
    this.http.post<any>('http://127.0.0.1:8000/api/posts', formData).subscribe(
      (postResponse) => {
        console.log("postResponse:", postResponse); // Log the response
        if (postResponse && postResponse.post_id) {
          this.linkPiecesToPost(postResponse.post_id); // Call linkPiecesToPost with the post_id obtained from the response
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
  

  linkPiecesToPost(postId: string) {
    const postPieceData = this.pieces.map(pieceId => {
      return {
        post_id: postId,
        piece_id: pieceId,
      };
    });

    // Submit the post_piece data to link the pieces to the post
    this.http.post<any>('http://127.0.0.1:8000/api/post_pieces', postPieceData).subscribe(
      (response) => {
        console.log(response);
        // Handle success, show a success message, etc.
      },
      (error) => {
        console.error(error);
        // Handle error, show an error message, etc.
      }
    );
  }

  ngOnInit() { }
}
