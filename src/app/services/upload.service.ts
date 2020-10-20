import { Injectable } from '@angular/core';
import {catchError, finalize} from 'rxjs/operators';
import {Observable, Subject, throwError} from 'rxjs';
import {CameraResultType, CameraSource, Plugins} from '@capacitor/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {LoadingController, ToastController} from '@ionic/angular';
import {SharedService} from './shared.service';
import {promise} from 'selenium-webdriver';
import {Photo} from '../models/Photo.model';
import {Task} from '../models/Task.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
    photosSubject:Subject<any>=new Subject<any>();
    photos:Photo[]=[]

    public error: string | null = null;
    photo: SafeResourceUrl | null = null;
    private counter = 0;
    private loading: HTMLIonLoadingElement | null = null;

    constructor(private  http: HttpClient,
                private  sanitizer: DomSanitizer,
                private  loadingCtrl: LoadingController,
                private  toastCtrl: ToastController,
                private sharedService:SharedService,
                private authService:AuthService) {
    }

    emitPhotos(){
        this.photosSubject.next(this.photos);
    }


    public async uploadAll(webPath: string) {

        this.loading = await this.loadingCtrl.create({
            message: 'Enregistrement...'
        });
        await this.loading.present();

        const blob = await fetch(webPath).then(r => r.blob());

        const formData = new FormData();
        formData.append('file', blob, `file-${this.counter++}.jpg`);
        this.http.post<Photo>(`${environment.backEndUrl}/upload`, formData)
            .pipe(
                catchError(e => this.handleError(e)),
                finalize(() => this.loading?.dismiss())
            )
            .subscribe((result:Photo) =>{console.log(result);this.photos.push(result);this.emitPhotos()} );
    }

    private async showToast(ok: boolean): Promise<void> {
        if (ok) {
            const toast = await this.toastCtrl.create({
                message: 'Upload reussie',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        } else {
            const toast = await this.toastCtrl.create({
                message: `erreur d'enregistrement de la photo`,
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }


    }
    public getFile(path:string){
       return `${environment.backEndUrl}/${path}`
    }



    private handleError(error: any): Observable<never> {
        const errMsg = error.message ? error.message : error.toString();
        this.error = errMsg;
        console.log(error)
        this.sharedService.showAlert(error.error.message)
        return throwError(errMsg);
    }


    deletePhoto(photo:Photo):Observable<Photo> {
        return new Observable(observer=>{
            this.http.delete(`${environment.backEndUrl}/user/deletePhoto?id=${photo.id}`,this.authService.httpOptions()).subscribe(
                res=>{
                    this.photos= this.photos.filter(obj => obj !==photo);
                    observer.complete();
                },
                error=>{observer.error(error)},
            )

        })
    }

    resetPhotos() {
        this.photos=[];
        this.emitPhotos();
    }

    deletePhotoSoft(photo: Photo):Observable<Photo> {
            return new Observable(observer=>{
                    this.photos= this.photos.filter(obj => obj !==photo);
                    observer.complete();

        })
    }
}
