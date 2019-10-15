import { Injectable } from '@angular/core';
import { User } from './models/user';
import { NbAuthService, NbAuthResult, NbLogoutComponent } from '@nebular/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, tap, mergeMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = '';
  private _user: User;
  private $isLoggedIn = new BehaviorSubject<boolean>(false);
  private $userChanged = new BehaviorSubject<User>(undefined);

  constructor(
    private nbAuthService: NbAuthService,
    private httpClient: HttpClient
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  get userChanged() {
    return this.$userChanged.asObservable();
  }

  private set user(user: User) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
    this.$isLoggedIn.next(this._user !== null);
    this.$userChanged.next(user);
  }

  get isLoggedIn() {
    return this.$isLoggedIn.asObservable();
  }

  loginWithGoogle() {
    this.nbAuthService
      .authenticate('google')
      .subscribe((authResult: NbAuthResult) => {});
  }

  loginWithGoogleCallback() {
    this.nbAuthService.isAuthenticated().subscribe(res => console.log(res));
    return this.nbAuthService.authenticate('google').pipe(
      tap((authResult: NbAuthResult) => {
        this._token = authResult.getToken().getPayload().access_token;
      }),
      mergeMap(res => this.getUserInfo())
    );
  }

  getUserInfo() {
    const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
    const httpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + this._token
    });
    return this.httpClient.get(url, { headers: httpHeaders }).pipe(
      tap((res: any) => {
        this.user = new User(res.name, res.email, res.picture);
      })
    );
  }

  logout() {
    this.nbAuthService.logout('google').subscribe(res => (this.user = null));
  }
}
