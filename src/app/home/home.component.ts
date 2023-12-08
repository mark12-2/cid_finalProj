import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(public afAuth: AngularFireAuth) {}

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }
}
