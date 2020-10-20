import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {AuthService} from '../../services/auth.service';
import {SharedService} from '../../services/shared.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models/User.model';
import {Subscription} from 'rxjs';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.page.html',
    styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

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
    ionViewWillEnter(){
        this.loadUser();
    }


    onGoToPublicArea() {
        this.router.navigate(['publicArea'])
    }

    ngOnInit() {

        this.form = new FormGroup({
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

        })
        this.userSubscription=this.usersService.userSubject.subscribe(
            (resultData)=>{
                this.loadedUser=resultData;
            }
        )

    }

    loadUser() {
        this.loadingCtrl.create({keyboardClose:true,spinner:'lines',message:'chargement...'}).then((loadingEl)=>{
                loadingEl.present();

            this.usersService.getUser(this.authService.curentUser.username).subscribe(
                () => {
                },
                (error) => {
                    loadingEl.dismiss();
                    this.sharedService.showAlert(error.error.message)



                },
                ()=>{
                    this.usersService.emitUser();
                    loadingEl.dismiss();

                }
            )
            }
        )

    }
onEdit(){
    this.alertCtrl.create(
        {
            header: 'Confirmation',
            message: "Voulez vous vraiment modifier votre Profile?",
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
   private edit() {
       this.loadingCtrl.create({keyboardClose:true,spinner:'lines',message:'enregistrement...'}).then((loadingEl)=>{
               loadingEl.present();
           this.usersService.editUser(this.loadedUser.username,this.form.value['name'],this.form.value['phone'],"",this.form.value['adress']).subscribe(
               (res) =>{
                   this.toastCtrl.create({
                       message: 'Modification enregistré', cssClass: 'ion-text-center'
                       , duration: 3000
                   }).then(
                       (modalEL) => {
                           loadingEl.dismiss();
                           this.router.navigate(['/userArea'])
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
