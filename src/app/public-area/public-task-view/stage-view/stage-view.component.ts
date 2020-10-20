import {Component, Input, OnInit} from '@angular/core';
import {Stage} from '../../../models/Stage.model';
import {ModalController} from '@ionic/angular';
import {PhotoViewComponent} from './photo-view/photo-view.component';
import {UploadService} from '../../../services/upload.service';

@Component({
  selector: 'app-stage-view',
  templateUrl: './stage-view.component.html',
  styleUrls: ['./stage-view.component.scss'],
})
export class StageViewComponent implements OnInit {
    @Input() stage:Stage;
  constructor(
      private modalCtrl:ModalController,
      private uploadService:UploadService ) { }

  ngOnInit() {
  }
    onCancel() {
        this.modalCtrl.dismiss({},'cancel');
    }

    onImageView(photoUrl:string){
        this.modalCtrl.create(
            {component:PhotoViewComponent,componentProps:{photoUrl:photoUrl}}
        ).then(modalEL=>{
            modalEL.present();
            return modalEL.onDidDismiss()
        }).then(resData=>{
            if(resData.role==='success'){
                //  this.loadLessons();
            }
        })
    }

    getfile(path)
    {
        return this.uploadService.getFile(path);
    }
}
