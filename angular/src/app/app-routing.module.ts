import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { RegisterComponentComponent } from './components/register-component/register-component.component';
import { ProfileComponentComponent } from './components/profile-component/profile-component.component';
import { PostFormComponentComponent } from './components/post-form-component/post-form-component.component';
import { HomeComponentComponent } from './components/home-component/home-component.component';

const routes: Routes = [
  {path: 'login', component: LoginComponentComponent},
  {path: 'register', component: RegisterComponentComponent},
  {path: 'home', component: HomeComponentComponent},
  {path: 'profile', component: ProfileComponentComponent},
  { path: 'share', component: PostFormComponentComponent},
  { path: '**', redirectTo: '/home', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
