import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {StagesService} from '../../../services/stages.service';
import {Task} from '../../../models/Task.model';
import {ImagePickerComponent} from '../../../shared/image-picker/image-picker.component';
import {HttpClient} from '@angular/common/http';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Photo} from '../../../models/Photo.model';
import {Subscription} from 'rxjs';
import {AlertController, LoadingController, ModalController, PopoverController} from '@ionic/angular';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {AuthService} from '../../../services/auth.service';
import {UploadService} from '../../../services/upload.service';
import {PhotoViewUserComponent} from '../../../shared/photo-view-user/photo-view-user.component';
import {TasksService} from '../../../services/tasks.service';
import {SharedService} from '../../../services/shared.service';
import {Stage} from '../../../models/Stage.model';

@Component({
  selector: 'app-edit-stage',
  templateUrl: './edit-stage.component.html',
  styleUrls: ['./edit-stage.component.scss'],
})
export class EditStageComponent implements OnInit {
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
    @Input()
     stage:Stage

    loadedPhotos:Photo[];
    photoSubscription:Subscription;
    photo: SafeResourceUrl | null = null;
    form:FormGroup;
    @ViewChild('imagePicker') imagePicker
    ngOnInit() {
        console.log('HomePage: ngOnInit')
        this.form=new FormGroup({

            comment:new FormControl(this.stage.comment,{
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




    ionViewWillEnter(){
        this.uploadService.emitPhotos();
    }

    onEditStage(){
        this.alertCtrl.create
        ({header:"confirmation",
            message:"voulez vous modifier cette Etape?",
            buttons:[
                {text:"oui",handler:()=>{
                        this.editStage(this.stage.id,this.form.value['comment'],this.task.id,this.loadedPhotos);
                    }},
                {text:"non",role:"cancel"}]})
            .then((alertEl)=>{alertEl.present()})


    }

    editStage(id,comment:string,taskId:string,photos: Photo[])
    {this.loadingCtrl.create({keyboardClose:true,spinner:'lines',message:'enregistrement...'}).then((loadingEl)=>{
            loadingEl.present();
            this.stagesService.editStage(id,comment,taskId,photos).subscribe(
                ()=>{},
                (error)=>{loadingEl.dismiss();
                    this.sharedService.showAlert(error.error.message)},
                ()=>{
                    loadingEl.dismiss();
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
            {component:PhotoViewUserComponent,componentProps:{photo:photo,mode:"edit"}}
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