import { Component, OnInit } from '@angular/core';
import {SharedService} from '../../services/shared.service';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {UsersService} from '../../services/users.service';
import {User} from '../../models/User.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
})
export class EditPasswordPage implements OnInit {


    form: FormGroup;
    loadedUser:User;
    userSubscription:Subscription;
    constructor(private usersService: UsersService,
                private authService: AuthService,
                private sharedService: SharedService,
                private router: Router,
                private loadingCtrl:LoadingController,
                private alertCtrl:AlertController,
                private toastCtrl:ToastController) {
    }


    onGoToPublicArea() {
        this.router.navigate(['publicArea'])
    }
    ionViewWillEnter(){
        this.form.reset();
    }

    ngOnInit() {

        this.form = new FormGroup({
            oldpassword: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required,
                    Validators.minLength(6)]
            }),
            password: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required,
                    Validators.minLength(6)]
            }),
            repassword: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required,
                    Validators.minLength(6)]
            }),

        }
            , this.pwdMatchValidator
        )
    }

    pwdMatchValidator(frm: FormGroup) {
        return frm.get('password').value === frm.get('repassword').value
            ? null : {'mismatch': true};
    }


    onEdit(){
      if(this.form.value['oldpassword']===this.form.value['password']){
        this.sharedService.showAlert("Le nouveau mot de passe doit etre different")
      }
      else{
        this.alertCtrl.create(
            {
                header: 'Confirmation',
                message: "Voulez vous vraiment modifier votre Mot de passe? vous allez vous deconnecter afin d'actualiser votre compte",
                buttons: [{
                    text: 'oui', handler: () => {
                        this.edit();
                    }
                }, {text: 'non', role: 'cancel'}]
            }
        ).then(alertEl => {
            alertEl.present()
        })
      }
    }
    private edit() {

        this.loadingCtrl.create({keyboardClose:true,spinner:'lines',message:'enregistrement...'}).then((loadingEl)=>{
                loadingEl.present();
            this.usersService.editPassword(this.authService.curentUser.username,this.form.value['oldpassword'],this.form.value['password']).subscribe(
                (res) =>{
                    this.toastCtrl.create({
                        message: 'Modification enregistré', cssClass: 'ion-text-center'
                        , duration: 3000
                    }).then(
                        (modalEL) => {
                            loadingEl.dismiss();
                            this.authService.logout();
                            modalEL.present()
                        }
                    )

                },
                (error) =>{this.sharedService.showAlert(error.error.message)}
            )
            }
        )

    }
}