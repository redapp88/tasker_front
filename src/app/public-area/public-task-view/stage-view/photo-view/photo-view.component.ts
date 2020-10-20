import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {UploadService} from '../../../../services/upload.service';

@Component({
  selector: 'app-photo-view',
  templateUrl: './photo-view.component.html',
  styleUrls: ['./photo-view.component.scss'],
})
export class PhotoViewComponent implements OnInit {

    @Input() photoUrl:string;
    constructor(private modalCtrl:ModalController,
                private uploadService:UploadService) { }

    ngOnInit() {
    }
    onCancel() {
        this.modalCtrl.dismiss({},'cancel');
    }
    getfile(path)
    {
        return this.uploadService.getFile(path);
    }
}
