import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CameraResultType, CameraSource, Capacitor, Plugins} from '@capacitor/core';
import {AlertController, LoadingController, Platform, PopoverController, ToastController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {UploadService} from '../../services/upload.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TasksService} from '../../services/tasks.service';
import {Router} from '@angular/router';
import {Photo} from '../../models/Photo.model';
import {SharedService} from '../../services/shared.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
    constructor(private router:Router,
                private authService:AuthService,
                private alertCtrl:AlertController,
                private loadingCtrl:LoadingController,
                private tasksService:TasksService,
                private sharedService:SharedService,
                private uploadService:UploadService,
                public popoverController: PopoverController,
                private readonly http: HttpClient,
                private readonly sanitizer: DomSanitizer,
                private readonly toastCtrl: ToastController) { }

    form:FormGroup;
    public error: string | null = null;
    photo: SafeResourceUrl | null = null;
    private counter = 0;
    private loading: HTMLIonLoadingElement | null = null;
    ngOnInit() {

    }
    async onTakePhoto(){
        const ab = await this.getPhoto(CameraSource.Prompt);
        if (ab) {
            await this.uploadService.uploadAll(ab)
        }
    }

    async onSelectPhoto() {
        const ab = await this.getPhoto(CameraSource.Photos);
        if (ab) {
            await  this.uploadService.uploadAll(ab);
        }
    }


    private async getPhoto(source: CameraSource) {
        const image = await Plugins.Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source
        });


        if (image.webPath) {
            this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
        }
        console.log(this.photo)
        return image.webPath;
    }
}