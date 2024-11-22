import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { MainComponent } from './features/main/main.component';
import { EditLinksComponent } from './features/main/edit-links/edit-links.component';
import { EditProfileComponent } from './features/main/edit-profile/edit-profile.component';
import { PreviewComponent } from './features/preview/preview.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: 'edit-links', component: EditLinksComponent },
      { path: 'edit-profile', component: EditProfileComponent },
      { path: '', redirectTo: 'edit-links', pathMatch: 'full' }
    ]
  },
  { path: 'preview', component: PreviewComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
