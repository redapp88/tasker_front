import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ModalController, NavController} from '@ionic/angular';
import {StagesService} from '../../services/stages.service';
import {Task} from '../../models/Task.model';[]
import {Subscription} from 'rxjs';
import {Stage} from '../../models/Stage.model';
import {SharedService} from '../../services/shared.service';
import {TasksService} from '../../services/tasks.service';
import {StageViewComponent} from './stage-view/stage-view.component';

@Component({
  selector: 'app-public-task-view',
  templateUrl: './public-task-view.page.html',
  styleUrls: ['./public-task-view.page.scss'],
})
export class PublicTaskViewPage implements OnInit {
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
              private loadingCtrl:LoadingController) { }

  ngOnInit() {
     this.route.paramMap.subscribe(

          paramMap=>{
              if(!paramMap.has("id") || this.tasksService.loadedTask == null){
                  this.navCtrl.navigateBack('publicArea');
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
                (error)=>{loadingEl.dismiss();this.sharedService.showAlert(error.error.message);},
                ()=>{
                    loadingEl.dismiss()
                    this.isLoading=false;
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
}
