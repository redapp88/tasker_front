import { Component, OnInit } from '@angular/core';
import {StagesService} from '../../services/stages.service';
import {TasksService} from '../../services/tasks.service';
import {StageViewComponent} from '../../public-area/public-task-view/stage-view/stage-view.component';
import {Task} from '../../models/Task.model';
import {Stage} from '../../models/Stage.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedService} from '../../services/shared.service';
import {Subscription} from 'rxjs';
import {AlertController, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {AddStageComponent} from './add-stage/add-stage.component';
import {UploadService} from '../../services/upload.service';
import {EditStageComponent} from './edit-stage/edit-stage.component';

@Component({
  selector: 'app-user-task-view',
  templateUrl: './user-task-view.page.html',
  styleUrls: ['./user-task-view.page.scss'],
})
export class UserTaskViewPage implements OnInit {
    taskId:string
    loadedStages:Stage[];
    stageSubscription:Subscription;
    loadedtask:Task;
    isLoading=false
    constructor(public route:ActivatedRoute,
                private router:Router,
                private navCtrl:NavController,
                private stagesService:StagesService,
                private tasksService:TasksService,
                private sharedService:SharedService,
                private modalCtrl:ModalController,
                private uploadService:UploadService,
                private alertCtrl:AlertController,
                private loadingCtrl:LoadingController,
                private toastCtrl:ToastController) { }

    ngOnInit() {
        this.route.paramMap.subscribe(

            paramMap=>{
                if(!paramMap.has("id") || this.tasksService.loadedTask == null){
                    this.navCtrl.navigateBack('userArea');
                    return
                }
                this.taskId=paramMap.get("id");
                this.loadedtask=this.tasksService.loadedTask;
                this.stageSubscription=this.stagesService.stagesSubject.subscribe(
                    (resultData)=>{
                        this.loadedStages=resultData;
                    }
                )

            })

    }


    ionViewWillEnter(){
        this.loadStages(this.taskId);

    }

    private loadStages(taskId){


        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'chargement...'}).then((loadingEl) => {
            loadingEl.present();
            this.stagesService.fetchStages(taskId).subscribe(
                ()=>{},
                (error)=>{loadingEl.dismiss();this.sharedService.showAlert(error.error.message);   },
                ()=>{
                    loadingEl.dismiss()
                }
            );
        })



    }
    onDetailsStage(stage:Stage){
        this.modalCtrl.create(
            {component:StageViewComponent,componentProps:{stage:stage}}
        ).then(modalEL=>{
            modalEL.present();
            return modalEL.onDidDismiss()
        }).then(resData=>{
            if(resData.role==='success'){
                //  this.loadLessons();
            }
        })
    }
    onAddStage(){
        this.uploadService.photos=[];
        this.modalCtrl.create(
            {component:AddStageComponent,componentProps:{task:this.loadedtask}}
        ).then(modalEL=>{
            modalEL.present();
            return modalEL.onDidDismiss()
        }).then(resData=>{
            if(resData.role==='success'){
              this.loadStages(this.taskId);
            }
        })
    }

    onEditStage(stage:Stage,slidingItem){
        slidingItem.close();
        this.uploadService.photos=stage.photos.slice();
        this.modalCtrl.create(
            {component:EditStageComponent,componentProps:{task:this.loadedtask,stage:stage}}
        ).then(modalEL=>{
            modalEL.present();
            return modalEL.onDidDismiss()
        }).then(resData=>{
            if(resData.role==='success'){
                this.loadStages(this.taskId);
            }
        })
    }

    onDeleteStage(id: string,slidingItem) {
        slidingItem.close();
        this.alertCtrl.create(
            {
                header: 'Confirmation',
                message: 'Voulez vous vraiment suppriemr cette etape',
                buttons: [{
                    text: 'oui', handler: () => {

                        this.deleteStage(id)
                    }
                }, {text: 'non', role: 'cancel'}]
            }
        ).then(alertEl => {
            alertEl.present()
        })
    }

    private deleteStage(id: string) {
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'Suppression...'}).then((loadingEl) => {
            this.stagesService.deleteStage(id).subscribe(
                () => {
                },
                (error) => {
                    this.sharedService.showAlert(error.error.message)
                },
                () => {
                    loadingEl.dismiss();
                    this.loadStages(this.taskId);
                    this.toastCtrl.create(
                        {message: 'Suppression Reussie', color: 'success', duration: 2000}
                    ).then(toastEl => {
                        toastEl.present()
                    })
                }
            )
        })
    }


    public onSocialShare(task: Task) {
        this.sharedService.socialMediaShare(task);

    }
}
