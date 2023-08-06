import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-component',
  templateUrl: './popup-component.component.html',
  styleUrls: ['./popup-component.component.css']
})
export class PopupComponentComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data)
   }

  ngOnInit(): void {
  }

}
