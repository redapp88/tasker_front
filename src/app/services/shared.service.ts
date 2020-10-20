import {Injectable} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {Task} from '../models/Task.model';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    constructor(private alertCtrl: AlertController,
                private socialSharing: SocialSharing,
                private platform: Platform) {
    }

    public showAlert(message: string) {

        if (message == null || message == '' || message.length == 0)
            message = 'erreur de connexion';
        else if (message === 'Unauthorized')
            message = 'Email ou mot de passe incorrect ';
        else if (message.includes('Maximum upload size exceeded'))
            message = 'Image trop volumeuse choisisez une photo de moin de 3 mb';

        //message=`${environment.backEndUrl}`+ message

        this.alertCtrl.create({header: 'Information', message: message, buttons: ['Ok']}).then(
            (alertEl => {
                alertEl.present()
            })
        )
    }

    socialMediaShare(task: Task) {
        let navigator: any;
        navigator = window.navigator;

        let body: string = `Bonjour!Suivez l'avancement de votre travail:${task.title} sur l'App Tasker disponible sur PlayStore et AppStore avec votre code secret : ${task.id}`
        let sujet = 'Votre code Tasker';
        if(!this.platform.is('cordova')){
        navigator.share({
            'title': sujet,
            'text': body
        }).then(function () {
            console.log('Successful share');
        }).catch(function (error) {
            console.log('Error sharing:', error)
        });
        }


        else{
        this.socialSharing.share(body, sujet).then(() => {

        }).catch(() => {
            // Error!
        })
    }
    }
}
