import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  username:string = ""
  password:string = ""

  constructor(private router: Router, private userService:UserService, private snackBar:MatSnackBar) { }

  ngOnInit(): void {
  }

  login(): void {
    this.userService.login(this.username, this.password).subscribe(
      (response: any) => {
        const token = response.token;
  
        localStorage.setItem('token', token);
  
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
  
        console.log('Decoded Token:', decodedToken);
  
        this.router.navigate(['/home']);

      },
      error => {
        console.error('Login error:', error);
        let errorMessage: string;
  
        if (error.status === 401) {
          errorMessage = 'Invalid username or password.';
        } else {
          errorMessage = 'An error occurred during login.';
        }
  
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    );
  }
  
  

}
