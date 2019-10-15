import { Component } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Price Drop Alert';

  constructor(private iconLibrary: NbIconLibraries) {
    this.iconLibrary.registerFontPack('font-awesome', {
      iconClassPrefix: 'fa',
      packClass: 'fa'
    });
    this.iconLibrary.setDefaultPack('font-awesome');
  }
}
