import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthData } from './auth-model'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({ providedIn:"root"})
export class AuthService{
  private isAuthenticated = false;
  private token : string;
  private authStatusListener = new Subject<boolean>();
  private loginTimer: any;
  constructor (private http: HttpClient, private router: Router){}


  getToken(){
    return this.token;
  }

  getAuthStatus(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  createUser(username:string, password: string){

    const data : AuthData  = {
      username:username,
      password:password
    }
    this.http.post("http://localhost:3000/api/user/signup", data)
             .subscribe((response => {
               console.log(response);
             }));
  }

  login(username:string,password:string){
    const data : AuthData = {
      username: username,
      password : password
    }
    //console.log(data);
    this.http.post<{token:string,expiresIn : number}>("http://localhost:3000/api/user/login",data)
              .subscribe(res => {
                const token = res.token;
                this.token = token;
                if(token){
                  this.authStatusListener.next(true);
                  this.isAuthenticated = true;
                  const now = new Date();
                  const expirationDate = new Date(now.getTime()+res.expiresIn*1000);
                  this.saveAuthData(token,expirationDate);
                  this.router.navigate(['/']);
                }
              })

  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.loginTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTime(expiresIn/1000);
      this.authStatusListener.next(true);

    }
  }

  private setAuthTime(duration : number){
    this.loginTimer = setTimeout(()=>this.logout(),duration*1000);
  }

  private saveAuthData(token:string, expirationDate: Date){
      localStorage.setItem("token",token);
      localStorage.setItem("expiration",expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if(!token || !expirationDate){
      this.router.navigate(['/login']);
    }
    return{
      token:token,
      expirationDate:new Date(expirationDate)
    }
  }
}
