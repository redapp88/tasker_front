import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {UsersService} from '../services/users.service';
import {SharedService} from '../services/shared.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export interface AuthData {
    username: string,
    password: string
}

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    scannedData: any;
    encodedData: '';
    encodeData: any;
    isLoging = true;
    inscrit: boolean = false;

    constructor(private authService: AuthService,
                private router: Router,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                public toastCtrl: ToastController,
                private usersService: UsersService,
                private sharedService: SharedService) {
    }

    form: FormGroup;

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
            name: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required,
                    Validators.minLength(4)]
            }),
            phone: new FormControl('', {
                updateOn: 'change',
                validators: []
            }),
            adress: new FormControl('', {
                updateOn: 'change',
                validators: []
            }),

        }, this.pwdMatchValidator)
    }

    pwdMatchValidator(frm: FormGroup) {
        return frm.get('password').value === frm.get('repassword').value
            ? null : {'mismatch': true};
    }

    ionViewWillEnter() {
        if (this.authService.curentUser)
            this.roleRedirecte();
        else {
            this.authService.autoLogin().subscribe(
                (resData) => {
                    if (resData) {
                        this.roleRedirecte();
                    }
                }
            )
        }
    }

    onAction() {
        if (this.isLoging) {
            if (!(this.form.controls.username.valid && this.form.controls.password.valid)) {
                return;
            }
            const username = this.form.value['username'];
            const password = this.form.value['password'];
            this.login(username, password);
        }
        else {
            if (!this.form.valid) {
                return;
            }
            const username = this.form.value['username'];
            const password = this.form.value['password'];
            const name = this.form.value['name'];
            const phone = this.form.value['phone'];
            const adress = this.form.value['adress'];

            this.subscribe(username, password, name, phone, adress);
        }
    }


    private login(username: string, password: string) {
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'login...'}).then((loadingEL) => {
            loadingEL.present();
            this.authService.login(username, password).subscribe(
                () => {
                },
                (error) => {
                    console.log(error)
                    loadingEL.dismiss();

                    this.sharedService.showAlert(error.error.message)
                },
                () => {

                    loadingEL.dismiss();
                    this.roleRedirecte();

                })
        })
    }


    private subscribe(username: string, password: string, name: string, phone: string, adress: string) {
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'Inscription...'}).then((loadingEL) => {
            loadingEL.present();
            this.authService.subscribe(username, password, name, phone, adress).subscribe(
                () => {

                    loadingEL.dismiss();
                    console.log('inscription reussie');
                    this.inscrit = true
                    //this.roleRedirecte();
                },
                (error) => {
                    console.log(error)
                    loadingEL.dismiss();

                    this.sharedService.showAlert(error.error.message)
                }
            )
        })
    }


    private authCodeToError(message: string) {
        if (message === 'Unauthorized')
            return 'Identifiant ou mot de passe inccorecte'

        else {
            return 'erreur de conexion'
        }

    }

    private roleRedirecte() {
        if (this.authService.isUser())
            this.router.navigate(['userArea']);
        else if (this.authService.isManager())
            this.router.navigate(['adminArea']);
        this.toastCtrl.create({
            message: 'Bienvenue ' + this.authService.curentUser.name, cssClass: 'ion-text-center'
            , duration: 3000
        }).then(
            (modalEL) => {
                modalEL.present()
            }
        )
    }

    onGoToPublicArea() {
        this.router.navigate(['publicArea'])
    }

    onSwitchAuthMode() {
        this.isLoging = !this.isLoging;
    }

    onRetour() {
        this.isLoging = true;
        this.inscrit = false;
    }

    segmentChanged(ev: any) {
        console.log('Segment changed', ev.detail.value);
        let value = ev.detail.value;
        if (value === 'login')
            this.isLoging = true;
        else
            this.isLoging = false;
    }

    loginValid() {
        return (this.form.controls.username.valid && this.form.controls.password.valid);
    }

    onGoForgetPassword() {
        this.router.navigate(["/forgetPassword"])
    }
}