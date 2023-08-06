import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { RegisterComponentComponent } from './components/register-component/register-component.component';
import { HomeComponentComponent } from './components/home-component/home-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { ProfileComponentComponent } from './components/profile-component/profile-component.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { PopupComponentComponent } from './components/popup-component/popup-component.component';
import { PostFormComponentComponent } from './components/post-form-component/post-form-component.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    RegisterComponentComponent,
    HomeComponentComponent,
    HomeLayoutComponent,
    ProfileComponentComponent,
    UnauthorizedComponent,
    PopupComponentComponent,
    PostFormComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
