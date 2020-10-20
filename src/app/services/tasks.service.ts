import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Task} from '../models/Task.model';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AppUser} from '../models/AppUser.model';
import {Plugins} from '@capacitor/core';
import {SharedService} from './shared.service';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    tasksSubject: Subject<any> = new Subject<any>();
    searchTasksSubject: Subject<any> = new Subject<any>();
    tasks: Task[]
    searchTasks: Task[];
    loadedTask = null;

    emitTasks() {
        this.tasksSubject.next(this.tasks);
    }

    emitSearchTasks() {
        this.searchTasksSubject.next(this.searchTasks);
    }

    constructor(private authService: AuthService,
                private http: HttpClient,
                private sharedService: SharedService) {
    }

    public fetchTasks(username: string, status: string[], keyword: string) {
        return new Observable(observer => {
            this.http.get
            (`${environment.backEndUrl}/user/tasks?username=${username}&status=${status}&keyword=${keyword}`, this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    this.tasks = resData;
                    console.log(resData);
                    this.emitTasks();
                    observer.complete()
                },
                (error) => {
                    observer.error(error)
                }
            )

        })
    }


    public getTask(taskId: string) {
        return new Observable(observer => {

            this.http.get
            (`${environment.backEndUrl}/public/task?taskId=${taskId}`, this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    this.tasks = [];
                    this.tasks[0] = resData;
                    this.emitTasks();
                    observer.complete()
                },
                (error) => {
                    console.log('error...')
                    observer.error(error)
                }
            )

        })
    }

    addTask(title: string, description: string, client: string, workerUsername: string) {
        return new Observable(observer => {
            this.http.post
            (`${environment.backEndUrl}/user/addTask`,
                {title: title, description: description, client: client, workerUsername: workerUsername},
                this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    observer.complete();
                },
                (error) => {
                    observer.error(error)
                }
            )
        })
    }

    editTask(id: string, title: string, description: string, client: string, workerUsername: string, state: string) {
        //console.log(id,title,description,client,workerUsername,state)
        return this.http.put
        (`${environment.backEndUrl}/user/editTask?id=${id}`,
            {title: title, description: description, client: client, workerUsername: workerUsername, state: state},
            this.authService.httpOptions())
    }

    deleteTask(id: string) {
        return this.http.delete(`${environment.backEndUrl}/user/deleteTask?id=${id}`
            , this.authService.httpOptions())
    }


    private storeLocalTasks(tasks: Task[]) {
        let searchTasks = JSON.stringify(tasks);
        Plugins.Storage.set({key: 'searchTasks', value: searchTasks})
    }

    public saveLocalTask(task: Task) {
        let index=this.containesInArray(this.searchTasks,task);
        console.log(index)
        if (index != -1) {
            this.searchTasks.splice(index, 1)
        }
        this.searchTasks.push(task);
        this.storeLocalTasks(this.searchTasks);
    }


    private containesInArray(tasks: Task[], task: Task) {
        let index = 0;
        let position=-1;
        tasks.forEach((t: Task) => {

         if(t.id===task.id){
          position=index;
         }
            index++;
        })
        return position;
    }


    public getLocalTasks() {
        return new Observable(observer => {
                Plugins.Storage.get({key: 'searchTasks'}).then(
                    (searchTasks) => {
                        //console.log(authData.value);
                        if (!searchTasks || !searchTasks.value) {
                            this.searchTasks = [];
                            observer.complete();

                        }
                        else {
                            let loadedTasks = JSON.parse(searchTasks.value) as Task[];
                            this.searchTasks = loadedTasks.slice(0,5).reverse();
                            observer.complete();

                        }
                    },
                    (error) => {
                        this.searchTasks = [];
                        observer.complete();
                    }
                )


            }
        )

    }

}
