import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
import {Stage} from '../models/Stage.model';
import {Observable, Subject} from 'rxjs';
import {Photo} from '../models/Photo.model';

@Injectable({
  providedIn: 'root'
})
export class StagesService {
    stagesSubject:Subject<any>=new Subject<any>();
    stages:Stage[]

    emitStages(){
        this.stagesSubject.next(this.stages);
    }

    constructor(private authService:AuthService,
                private http:HttpClient) {
    }

    public fetchStages(taskId:string){
        return new Observable(observer=>{

            this.http.get
            (`${environment.backEndUrl}/public/stages?taskId=${taskId}`,this.authService.httpOptions()).subscribe(
                (resData:any)=>{
                    this.stages=resData;
                    this.emitStages();
                    observer.complete()
                },
                (error)=>{observer.error(error)}
            )

        })
    }


    addStage(comment: string, taskId: string, photos: Photo[] ) {
        return new Observable(observer=>{
            this.http.post
            (`${environment.backEndUrl}/user/addStage`,
                {comment:comment,taskId:taskId,photos:photos},
                this.authService.httpOptions()).subscribe(
                (resData:any)=>{
                    observer.complete();
                },
                (error)=>{observer.error(error)}
            )
        })
    }

    editStage(id:number,comment: string, taskId: string, photos: Photo[] ) {
        return  this.http.put
        (`${environment.backEndUrl}/user/editStage?id=${id}`,
            {comment:comment,taskId:taskId,photos:photos},
            this.authService.httpOptions())
    }

    deleteStage(id:string){
        return this.http.delete(`${environment.backEndUrl}/user/deleteStage?id=${id}`
            ,this.authService.httpOptions())
    }
}
