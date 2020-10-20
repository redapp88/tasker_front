import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {TasksService} from '../../../services/tasks.service';
import {AuthService} from '../../../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SharedService} from '../../../services/shared.service';
import {AlertController, LoadingController, ModalController, PopoverController, ToastController} from '@ionic/angular';
import {Photo} from '../../../models/Photo.model';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {environment} from '../../../../environments/environment';
import {Observable, Subscription, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {UploadService} from '../../../services/upload.service';
import {ImagePickerComponent} from '../../../shared/image-picker/image-picker.component';
import {Stage} from '../../../models/Stage.model';
import {PhotoViewComponent} from '../../../public-area/public-task-view/stage-view/photo-view/photo-view.component';
import {PhotoViewUserComponent} from '../../../shared/photo-view-user/photo-view-user.component';
import {StagesService} from '../../../services/stages.service';
import {Task} from '../../../models/Task.model';

@Component({
  selector: 'app-add-stage',
  templateUrl: './add-stage.component.html',
  styleUrls: ['./add-stage.component.scss'],
})
export class AddStageComponent implements OnInit {
    constructor(private router:Router,
                private authService:AuthService,
                private alertCtrl:AlertController,
                private loadingCtrl:LoadingController,
                private tasksService:TasksService,
                private stagesService:StagesService,
                private sharedService:SharedService,
                private uploadService:UploadService,
                public popoverController: PopoverController,
                private  http: HttpClient,
                private  sanitizer: DomSanitizer,
                private  modalCtrl: ModalController) { }
    @Input()
    task:Task;

    loadedPhotos:Photo[];
    photoSubscription:Subscription;
    photo: SafeResourceUrl | null = null;
    form:FormGroup;
    @ViewChild('imagePicker') imagePicker
    ngOnInit() {

        this.form=new FormGroup({

            comment:new FormControl('',{
                updateOn:'change',
                validators:[Validators.required,
                    Validators.minLength(4)]
            })
        })
        this.photoSubscription=this.uploadService.photosSubject.subscribe(
            (resultData)=>{
                this.loadedPhotos=resultData;
            }
        )

    }


    onAddStage(){
        console.log("$$$$$",this.task);
        this.alertCtrl.create
        ({header:"confirmation",
            message:"voulez vous Ajouter cette Etape?",
            buttons:[
                {text:"oui",handler:()=>{
                        this.addStage(this.form.value['comment'],this.task.id,this.loadedPhotos);
                    }},
                {text:"non",role:"cancel"}]})
            .then((alertEl)=>{alertEl.present()})


    }

    addStage(comment:string,taskId:string,photos: Photo[])
    {this.loadingCtrl.create({keyboardClose:true,spinner:'lines',message:'enregistrement...'}).then((loadingEl)=>{
                loadingEl.present();
                this.stagesService.addStage(comment,taskId,photos).subscribe(
                    ()=>{},
                    (error)=>{loadingEl.dismiss();
                        this.sharedService.showAlert(error.error.message)},
                    ()=>{
                        loadingEl.dismiss();
                        this.clearFields();
                        this.modalCtrl.dismiss({},'success');loadingEl.dismiss();
                    }
                )
            }
        )
    }


    async onTakePhoto(){
        const ab = await this.getPhoto(CameraSource.Prompt);
        if (ab) {
            await this.uploadService.uploadAll(ab)
        }
    }


    private async getPhoto(source: CameraSource) {
        const image = await Plugins.Camera.getPhoto({
            quality: 50,
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
    onPickImage(){
     this.popoverController.create({
            component: ImagePickerComponent,
            cssClass: 'my-custom-class',
            translucent: true
        }).then(pop => {
            pop.present()
        })
    }



    getfile(path)
    {
        return this.uploadService.getFile(path);
    }

    onImageView(photo:Photo){
        console.log(photo)
        this.modalCtrl.create(
            {component:PhotoViewUserComponent,componentProps:{photo:photo,mode:"add"}}
        ).then(modalEL=>{
            modalEL.present();
            return modalEL.onDidDismiss()
        }).then(resData=>{
            if(resData.role==='success'){
             this.uploadService.emitPhotos();
            }
        })
    }

    onCancel() {
        this.modalCtrl.dismiss({},'cancel');
    }

    private clearFields(){
        this.form.reset()
    }
}