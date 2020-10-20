import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PublicTaskViewPageRoutingModule } from './public-task-view-routing.module';

import { PublicTaskViewPage } from './public-task-view.page';
import {ComponentsModule} from '../../components.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PublicTaskViewPageRoutingModule,
      ComponentsModule
  ],
  declarations: [PublicTaskViewPage]
})
export class PublicTaskViewPageModule {}
