import {Component, Input, OnInit} from '@angular/core';
import {TasksService} from '../../services/tasks.service';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SharedService} from '../../services/shared.service';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {Task} from '../../models/Task.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
    @Input() task:Task;
    form:FormGroup;

    constructor(private router:Router,
                private authService:AuthService,
                private alertCtrl:AlertController,
                private loadingCtrl:LoadingController,
                private tasksService:TasksService,
                private sharedService:SharedService,
                private modalCtrl:ModalController) { }


    ngOnInit() {

        this.form=new FormGroup({
            title:new FormControl(this.task.title,{
                updateOn:'change',
                validators:[Validators.required,
                    Validators.minLength(4)]
            }),
            description:new FormControl(this.task.description,{
                updateOn:'change',
                validators:[Validators.required,
                    Validators.minLength(4)]
            }),
            client:new FormControl(this.task.client,{
                updateOn:'change',
                validators:[Validators.required,
                    Validators.minLength(4)]
            })
        })


    }


    onEditTask(){
        this.alertCtrl.create
        ({header:"confirmation",
            message:"voulez vous Editer ce Task?",
            buttons:[
                {text:"oui",handler:()=>{
                        this.editTask(this.task.id,this.form.value['title'],this.form.value['description'],this.form.value['client'],this.task.state);
                    }},
                {text:"non",role:"cancel"}]})
            .then((alertEl)=>{alertEl.present()})


    }

    editTask(id:string,title:string,description:string,client:string,state:string){
        this.loadingCtrl.create({keyboardClose:true,spinner:'lines',message:'enregistrement...'}).then((loadingEl)=>{
                loadingEl.present();
                this.tasksService.editTask(id,title,description,client,this.authService.curentUser.username,state).subscribe(
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

    onCancel() {
        this.modalCtrl.dismiss({},'cancel');
    }
    private clearFields(){
        this.form.reset()
    }

}
