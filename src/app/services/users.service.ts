import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {Observable, Subject} from 'rxjs';
import {Stage} from '../models/Stage.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../models/User.model';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    usersSubject:Subject<any>=new Subject<any>();
    userSubject:Subject<any>=new Subject<any>();
    users:User[]
    user:User;

    emitUsers(){
        this.usersSubject.next(this.users);
    }
    emitUser(){
        this.userSubject.next(this.user);
    }

    constructor(private authService:AuthService,
                private http:HttpClient,
                private alertCtrl:AlertController) {
    }

    public fetchUsers(keyword:string,state:string){
        return new Observable(observer=>{

            this.http.get
            (`${environment.backEndUrl}/admin/usersList?keyword=${keyword}&?state=${state}`,this.authService.httpOptions()).subscribe(
                (resData:any)=>{
                    this.users=resData;
                    this.emitUsers();
                    observer.complete()
                },
                (error)=>{observer.error(error)}
            )

        })
    }


    subscribe(username: string, password: string, name: string,phone:string,mail:string,adress:string ) {
        return new Observable(observer=>{
            this.http.post
            (`${environment.backEndUrl}/user/addStage`,
                {username:username,password:password,name:name,phone:phone,mail:mail,adress:adress},
                this.authService.httpOptions()).subscribe(
                (resData:any)=>{
                    observer.complete();
                },
                (error)=>{observer.error(error)}
            )
        })
    }

    editUser(username: string,name: string,phone:string,mail:string,adress:string ) {
        return  this.http.put
        (`${environment.backEndUrl}/user/editUser?username=${username}`,
            {name:name,phone:phone,mail:mail,adress:adress},
            this.authService.httpOptions())
    }
    editPassword(username: string,oldpassword:string,password: string ) {
        console.log(oldpassword,password);
        return  this.http.put
        (`${environment.backEndUrl}/user/editPassword?username=${username}`,
            {oldpassword:oldpassword,password:password},
            this.authService.httpOptions())
    }

    deleteUser(username:string){
        return this.http.delete(`${environment.backEndUrl}admin/deleteUser?username=${username}`
            ,this.authService.httpOptions())
    }



    getUser(username: string) {
        return new Observable(observer=>{
            this.http.get
            (`${environment.backEndUrl}/user/getUser?username=${username}`,
                this.authService.httpOptions()).subscribe(
                (resData:any)=>{
                 this.user=resData;
                    observer.complete();
                },
                (error)=>{observer.error(error)}
            )
        })

    }

    resetPassword(username: string,password:string) {
        return new Observable(observer=>{
            this.http.put
            (`${environment.backEndUrl}/resetPassword?username=${username}`,{password:password}).subscribe(
                ()=>{
                    observer.complete();
                },
                (error)=>{console.log(error),observer.error(error)}
            )
        })
    }





}
