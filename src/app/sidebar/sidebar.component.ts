import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUserEmail: string | null = null;

  constructor(private authService: AuthService, public afAuth: AngularFireAuth, public router: Router) { }

  async ngOnInit(): Promise<void> {
    this.currentUserEmail = await this.authService.getUserEmail();
  }

  
}