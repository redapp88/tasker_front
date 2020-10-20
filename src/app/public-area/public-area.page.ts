import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadingController} from '@ionic/angular';
import {TasksService} from '../services/tasks.service';
import {Subscription} from 'rxjs';
import {Task} from '../models/Task.model';
import {SharedService} from '../services/shared.service';

@Component({
    selector: 'app-public-area',
    templateUrl: './public-area.page.html',
    styleUrls: ['./public-area.page.scss'],
})
export class PublicAreaPage implements OnInit {
    form: FormGroup;
    loadedTasks: Task[];
    loadedSearchTasks: Task[];
    taskSubscription: Subscription;
    loadedTaskSubscription: Subscription;

    constructor(private router: Router,
                private loadingCtrl: LoadingController,
                private tasksService: TasksService,
                private sharedService: SharedService) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            taskId: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required,
                    Validators.minLength(4)]
            })
        })
        this.taskSubscription = this.tasksService.tasksSubject.subscribe(
            (resultData) => {
                this.loadedTasks = resultData;
            }
        )
        this.loadedTaskSubscription = this.tasksService.searchTasksSubject.subscribe(
            (resultData) => {
                this.loadedSearchTasks = resultData;
            }
        )


    }
    ionViewWillEnter(){
        this.clearFields();
        this.tasksService.getLocalTasks().subscribe(
            ()=>{},
            ()=>{},
            ()=>{this.tasksService.emitSearchTasks()}
        )
    }

    onGoToUserArea() {
        this.router.navigateByUrl('/userArea')
    }

    onSearchTask() {
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'recherche...'}).then((loadingEl) => {
            loadingEl.present();
            let taskId = this.form.value['taskId'];
            console.log('task id ', taskId)
            this.tasksService.getTask(taskId).subscribe(
                () => {
                },

                (error) => {
                    loadingEl.dismiss();
                    this.sharedService.showAlert(error.error.message)
                },

                () => {
                    if (this.loadedTasks.length <= 0) {
                        loadingEl.dismiss();
                        this.sharedService.showAlert('Task Introuvable');
                    }
                    else {
                        this.tasksService.loadedTask = this.loadedTasks[0];
                        this.tasksService.saveLocalTask(this.loadedTasks[0]);
                        loadingEl.dismiss();
                        this.router.navigate(['publicArea', 'taskId', taskId]);
                    }
                }
            )
        })
    }

    private clearFields(){
        this.form.reset()
    }

    onGetFromSearch(task: Task) {
        this.form.get('taskId').setValue(task.id);
        this.onSearchTask()

    }
}
