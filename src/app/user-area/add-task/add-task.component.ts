import { Component, OnInit } from '@angular/core';
import {TasksService} from '../../services/tasks.service';
import {Task} from '../../models/Task.model';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SharedService} from '../../services/shared.service';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {PhotoViewComponent} from '../../public-area/public-task-view/stage-view/photo-view/photo-view.component';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
    constructor(private router:Router,
                private authService:AuthService,
                private alertCtrl:AlertController,
                private loadingCtrl:LoadingController,
                private tasksService:TasksService,
                private sharedService:SharedService,
                private modalCtrl:ModalController) { }

    form:FormGroup;

    ngOnInit() {

        this.form=new FormGroup({
            title:new FormControl('',{
                updateOn:'change',
                validators:[Validators.required,
                    Validators.minLength(4)]
            }),
            description:new FormControl('',{
                updateOn:'change',
                validators:[Validators.required,
                    Validators.minLength(4)]
            }),
            client:new FormControl('',{
                updateOn:'change',
                validators:[Validators.required,
                    Validators.minLength(4)]
            })
        })


    }


    onAddTask(){
        this.alertCtrl.create
        ({header:"confirmation",
            message:"voulez vous Ajouter ce Task?",
            buttons:[
                {text:"oui",handler:()=>{
                        this.addTask(this.form.value['title'],this.form.value['description'],this.form.value['client']);
                    }},
                {text:"non",role:"cancel"}]})
            .then((alertEl)=>{alertEl.present()})


    }

    addTask(title:string,description:string,client:string){
        this.loadingCtrl.create({keyboardClose:true,spinner:'lines',message:'enregistrement...'}).then((loadingEl)=>{
                loadingEl.present();
                this.tasksService.addTask(title,description,client,this.authService.curentUser.username).subscribe(
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

    onImageView(photoUrl:string){
      /*  this.modalCtrl.create(
            {component:PhotoViewUserComponent,componentProps:{photoUrl:photoUrl}}
        ).then(modalEL=>{
            modalEL.present();
            return modalEL.onDidDismiss()
        }).then(resData=>{
            if(resData.role==='success'){
                //  this.loadLessons();
            }
        })*/
    }
    onCancel() {
        this.modalCtrl.dismiss({},'cancel');
    }
    private clearFields(){
        this.form.reset()
    }

}
