import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup-component',
  templateUrl: './popup-component.component.html',
  styleUrls: ['./popup-component.component.css']
})
export class PopupComponentComponent implements OnInit {

  currentRoute: string | undefined;
  postings: any[] = []

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router:Router, private http: HttpClient, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<PopupComponentComponent>) {

}

  ngOnInit(): void {
    this.currentRoute = this.router.url

  }

  deletePost(postId: number): void {
    this.http.delete(`http://127.0.0.1:8000/api/posts/${postId}`).subscribe(
      (response: any) => {
        this.dialogRef.close()
        window.location.reload()
      },
      (error: any) => {
      }
    );
  }


}
