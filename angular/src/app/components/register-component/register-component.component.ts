import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.css']
})
export class RegisterComponentComponent implements OnInit {

  name:string = ""
  surname:string = ""
  username:string = ""
  password:string = ""
  confirmPassword:string = ""
  email:string = ""

  user:User = new User()

  constructor(private userService:UserService, private snackBar:MatSnackBar, private router:Router) { }

  ngOnInit(): void {
  }

  save(){

    if (!this.name || !this.surname || !this.username || !this.password || !this.email || !this.confirmPassword) {
      this.snackBar.open('Please fil8i9l in all fields.', 'Close', {
        duration: 5000 
      });
      return;
    }
  

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(this.password)) {
      this.snackBar.open('Password should have at least 8 characters, including one uppercase letter, one lowercase letter, and one digit.', 'Close', {
        duration: 5000
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.snackBar.open('Please enter a valid email address.', 'Close', {
        duration: 5000 
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Passwords must be equal.', 'Close', {
        duration: 5000 
      });
      return;
    }




    this.user.name = this.name
    this.user.surname = this.surname
    this.user.username = this.username
    this.user.password = this.password
    this.user.email = this.email



    this.userService.saveUser(this.user).subscribe(
      res => {
        this.snackBar.open('User registered successfully!', 'Close', {
          duration: 5000 
        });
        this.router.navigate(['/login'])
      },
      error => {
        this.snackBar.open('Error occurred while saving the user.', 'Close', {
          duration: 5000 
        });
      }
    );
  }

  }
