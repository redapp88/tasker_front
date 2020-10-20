import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAreaPageRoutingModule } from './user-area-routing.module';

import { UserAreaPage } from './user-area.page';
import {ComponentsModule} from '../components.module';
import {AddTaskComponent} from './add-task/add-task.component';
import {EditTaskComponent} from './edit-task/edit-task.component';
import {TopMenuComponent} from '../shared/top-menu/top-menu.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserAreaPageRoutingModule,
      ReactiveFormsModule,
      ComponentsModule


  ],
    exports:[],
  declarations: [UserAreaPage,AddTaskComponent,EditTaskComponent],
    entryComponents:[AddTaskComponent,EditTaskComponent]
})
export class UserAreaPageModule {}
