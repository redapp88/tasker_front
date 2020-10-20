import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTaskViewPageRoutingModule } from './user-task-view-routing.module';

import { UserTaskViewPage } from './user-task-view.page';
import {AddStageComponent} from './add-stage/add-stage.component';
import {ComponentsModule} from '../../components.module';
import {PhotoViewUserComponent} from '../../shared/photo-view-user/photo-view-user.component';
import {EditStageComponent} from './edit-stage/edit-stage.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserTaskViewPageRoutingModule,
      ReactiveFormsModule,
      ComponentsModule
  ],
    exports:[AddStageComponent],
    entryComponents:[AddStageComponent,PhotoViewUserComponent,EditStageComponent],
  declarations: [UserTaskViewPage,AddStageComponent,EditStageComponent,PhotoViewUserComponent]
})
export class UserTaskViewPageModule {}
