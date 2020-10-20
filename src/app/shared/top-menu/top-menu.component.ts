import { Component, OnInit } from '@angular/core';
import {User} from '../../models/User.model';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {

  constructor(private authService:AuthService,
              private router:Router,
              private alertCtrl:AlertController) { }
private userName:string
  ngOnInit() {
      this.userName=this.authService.curentUser.name;
  }

    onRoute(link: string)
    {
        this.router.navigate([link]);
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

}
