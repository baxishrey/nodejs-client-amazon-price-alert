import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { BehaviorSubject } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { User } from './models/user';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = '';
  private _user: User;
  private _tokenExpiry: Date;
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

  isTokenExpired() {
    if (!this._token) {
      return false;
    }
    if (this._tokenExpiry === undefined) {
      return true;
    }
    return !(this._tokenExpiry.valueOf() > new Date().valueOf());
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
        const expiresIn = parseInt(
          authResult.getToken().getPayload().expires_in,
          10
        );
        this._token = authResult.getToken().getPayload().access_token;
        const createdAt = authResult.getToken().getCreatedAt();
        let mom_CreatedAt = moment(createdAt);

        mom_CreatedAt.add(expiresIn, 'seconds');

        this._tokenExpiry = mom_CreatedAt.toDate();
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
    this.nbAuthService.logout('google').subscribe(res => {
      this.user = null;
      this._token = '';
      this._tokenExpiry = undefined;
      this.$isLoggedIn.next(false);
    });
  }
}
