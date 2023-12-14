import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService, public afAuth: AngularFireAuth, private router: Router) { }

  isLoggedIn(): boolean {
    return this.authService.userLoggedIn.getValue();
  }

  async logout(): Promise<void> {
    try { 
      await this.afAuth.signOut();
      this.authService.userLoggedIn.next(false); 
      console.log('Logged out successfully');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }

}
