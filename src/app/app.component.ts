import {Component, enableProdMode} from '@angular/core';

import {AlertController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService:AuthService,
    private router:Router,
    private alertCtrl:AlertController
  ) {
    this.initializeApp();
  }
    private userName:string
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }

    ngOnInit() {
    }
    onLogout() {
        this.alertCtrl.create(
            {
                header: 'Confirmation',
                message: 'Voulez vous vraiment vous déconnecter',
                buttons: [{
                    text: 'oui', handler: () => {
                        this.authService.logout();
                    }
                }, {text: 'non', role: 'cancel'}]
            }
        ).then(alertEl => {
            alertEl.present()
        })
    }

    public isLogged(){
      return this.authService.isUser();
    }
}
