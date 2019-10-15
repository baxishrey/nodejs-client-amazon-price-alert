import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user';
import { NbMenuService, NB_WINDOW } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  user: User;
  logOutText = 'Log out';
  userMenu = [{ title: this.logOutText }];
  constructor(
    private authService: AuthService,
    private nbMenuService: NbMenuService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.userChanged.subscribe((user: User) => {
      this.user = user;
    });

    this.authService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'auth-menu'),
        map(({ item: { title } }) => title)
      )
      .subscribe(title => {
        if (title === this.logOutText) {
          this.authService.logout();
          this.router.navigate(['/home']);
        }
      });
  }
}
