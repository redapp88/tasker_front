import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {SharedService} from '../services/shared.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {UsersService} from '../services/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
    constructor(private authService: AuthService,
                private router: Router,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                public toastCtrl: ToastController,
                private usersService: UsersService,
                private sharedService: SharedService) {

    }

    form: FormGroup;
    isReset=false;

    ngOnInit() {

        this.form = new FormGroup({
            username: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required,
                    Validators.email]
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
            , this.pwdMatchValidator)
    }

    pwdMatchValidator(frm: FormGroup) {
        return frm.get('password').value === frm.get('repassword').value
            ? null : {'mismatch': true};
    }

ionViewWillEnter(){
      this.form.reset();
      this.isReset=false;
}




    public onAction() {
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'chargement...'}).then((loadingEL) => {
            loadingEL.present();
            this.usersService.resetPassword(this.form.value['username'],this.form.value['password']).subscribe(
                () => {
                },
                (error) => {
                    console.log(error)
                    loadingEL.dismiss();

                    this.sharedService.showAlert(error.error.message)
                },
                () => {

                    loadingEL.dismiss();
                    this.isReset=true;

                })
        })
    }






    onGoToLogin() {
        this.router.navigate(['login'])
    }


}