import { Component, OnDestroy, OnInit } from '@angular/core';
import { templateJitUrl } from '@angular/compiler';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy, OnInit {
  isAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService : AuthService){}

  ngOnInit(){
    this.isAuthenticated = this.authService.getAuthStatus();
    this.authListenerSubs = this.authService.getAuthStatusListener()
                                            .subscribe(isAuthenticated => {
                                              this.isAuthenticated = isAuthenticated;
                                            });
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

  onLogOut(){
    this.authService.logout();
  }
}
