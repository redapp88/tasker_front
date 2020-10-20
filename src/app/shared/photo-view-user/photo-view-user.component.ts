import {Component, Input, OnInit} from '@angular/core';
import {AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';
import {Photo} from '../../models/Photo.model';
import {UploadService} from '../../services/upload.service';
import {SharedService} from '../../services/shared.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-photo-view-user',
  templateUrl: './photo-view-user.component.html',
  styleUrls: ['./photo-view-user.component.scss'],
})
export class PhotoViewUserComponent implements OnInit {

    @Input() photo:Photo;
    @Input() mode:string;
    constructor
    (private modalCtrl:ModalController,
     private uploadService:UploadService,
     private alertCtrl:AlertController,
     private loadingCtrl:LoadingController,
     private sharedService:SharedService,
     private toastctrl:ToastController) { }

    ngOnInit() {
    }
    ionViewWillEnter() {

    }
    onCancel() {
        this.modalCtrl.dismiss({},'cancel');
    }

    getfile(path)
    {
        console.log(this.uploadService.getFile(path))
        return this.uploadService.getFile(path);
    }

    onDeletetPhoto(photo:Photo) {
        this.alertCtrl.create(
            {
                header: 'Confirmation',
                message: 'Voulez vous vraiment supprimer cette photo',
                buttons: [{
                    text: 'oui', handler: () => {
                        this.deletePhoto(photo)
                    }
                }, {text: 'non', role: 'cancel'}]
            }
        ).then(alertEl => {
            alertEl.present()
        })
    }

    private deletePhoto(photo:Photo) {
        let action:Observable<Photo>;
        if(this.mode ==='edit')
            action=this.uploadService.deletePhotoSoft(photo);
        else
             action=this.uploadService.deletePhoto(photo);
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'Suppression...'}).then((loadingEl) => {
            action.subscribe(
                () => {
                },
                (error) => {
                    this.sharedService.showAlert(error.error.message)
                },
                () => {
                    loadingEl.dismiss();
                   // this.onLoadTask();
                    this.toastctrl.create(
                        {message: 'Suppression Reussie', color: 'success', duration: 2000}
                    ).then(toastEl => {
                        this.modalCtrl.dismiss({},'success');
                        toastEl.present();
                    })
                }
            )
        })
    }
}
