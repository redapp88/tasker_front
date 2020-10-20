import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';
import {Task} from '../models/Task.model';
import {TasksService} from '../services/tasks.service';
import {SharedService} from '../services/shared.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AddTaskComponent} from './add-task/add-task.component';
import {EditTaskComponent} from './edit-task/edit-task.component';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';


@Component({
    selector: 'app-user-area',
    templateUrl: './user-area.page.html',
    styleUrls: ['./user-area.page.scss'],
})
export class UserAreaPage implements OnInit {

    constructor(private router: Router,
                private authService: AuthService,
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                private tasksService: TasksService,
                private sharedService: SharedService,
                private modalCtrl: ModalController,
                private toastctrl: ToastController,
                private socialSharing: SocialSharing) {
    }

    currentUserName: string;
    loadedTasks: Task[];
    tasksSubscription: Subscription;
    isLoading = false;
    userSubscription: Subscription;
    formSearch: FormGroup;

    ngOnInit() {

        this.formSearch = new FormGroup({
            keyword: new FormControl('', {}),
            current: new FormControl(true, {}),
            ended: new FormControl(false, {})
        })

        this.userSubscription = this.authService.userSubject.subscribe(
            (resData) => {
                if (resData === null) {
                    this.router.navigate(['/login'])
                }
                else {


                    this.currentUserName = this.authService.curentUser.name;

                }
            }
        )


    }

    onGoToPublicArea() {
        this.router.navigate(['publicArea'])
    }


    onLogout() {
        this.authService.logout()
    }

    ionViewWillEnter() {
        this.tasksSubscription = this.tasksService.tasksSubject.subscribe(
            (resultData) => {
                //console.log(resultData);
                this.loadedTasks = resultData;

            }
        )
        // console.log("realoded///",this.authService.isUser(),this.authService.curentUser.username)
        if (!this.authService.isUser()) {
            this.router.navigate(['/login'])
        }
        else
            this.onLoadTask();

    }

    loadTasks(username: string, keyword: string, status: string[]) {

        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'chargement...'}).then((loadingEl) => {
            loadingEl.present();
            this.tasksService.fetchTasks(username, status, keyword).subscribe(
                () => {
                },
                (error) => {
                    loadingEl.dismiss();
                    this.sharedService.showAlert(error.error.message)
                },
                () => {
                    loadingEl.dismiss();
                }
            )
        })
    }

    onLoadTask() {
        //console.log(this.authService.curentUser.username, this.formSearch.value['keyword'], this.formSearch.value['current'], this.formSearch.value['ended'])
        let status: string[] = [];
        if (this.formSearch.value['current'])
            status[0] = 'current';
        if (this.formSearch.value['ended'])
            status[1] = 'ended';
        if (status.length < 1)
            status[0] = 'nothing';
        //console.log(status)
        this.loadTasks(this.authService.curentUser.username, this.formSearch.value['keyword'], status)

    }


    onAddTask() {
        this.modalCtrl.create(
            {component: AddTaskComponent, componentProps: {}}
        ).then(modalEL => {
            modalEL.present();
            return modalEL.onDidDismiss()
        }).then(resData => {
            if (resData.role === 'success') {
                this.clearFields();
                this.onLoadTask();
            }
        })
    }


    onEditTask(task: Task, slidingItem) {
        slidingItem.close();
        this.modalCtrl.create(
            {component: EditTaskComponent, componentProps: {task: task}}
        ).then(modalEL => {
            modalEL.present();
            return modalEL.onDidDismiss()
        }).then(resData => {
            if (resData.role === 'success') {
                this.clearFields();
                this.onLoadTask();
            }
        })
    }

    onDeleteTask(id: string, slidingItem) {
        slidingItem.close();
        this.alertCtrl.create(
            {
                header: 'Confirmation',
                message: 'Voulez vous vraiment suppriemr ce Task',
                buttons: [{
                    text: 'oui', handler: () => {
                        this.deleteTask(id)
                    }
                }, {text: 'non', role: 'cancel'}]
            }
        ).then(alertEl => {
            alertEl.present()
        })
    }

    private deleteTask(id: string) {
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'Suppression...'}).then((loadingEl) => {
            this.tasksService.deleteTask(id).subscribe(
                () => {
                },
                (error) => {
                    this.sharedService.showAlert(error.error.message)
                },
                () => {
                    loadingEl.dismiss();
                    this.onLoadTask();
                    this.toastctrl.create(
                        {message: 'Suppression Reussite', color: 'success', duration: 2000}
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

    onViewTask(task: Task) {
        console.log(task)
        this.tasksService.loadedTask = task;
        this.router.navigate(['userArea', 'taskId', task.id]);
    }

    private clearFields() {
        this.formSearch.patchValue({keyword: '', current: true, ended: false})
    }

    onCheckChange() {
        if (!this.formSearch.value['current'] && !this.formSearch.value['ended']) {
            this.formSearch.patchValue({current: true, ended: false})
        }
    }
}
