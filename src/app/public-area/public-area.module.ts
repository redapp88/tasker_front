import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PublicAreaPageRoutingModule } from './public-area-routing.module';

import { PublicAreaPage } from './public-area.page';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PublicAreaPageRoutingModule,
      ReactiveFormsModule,
      FormsModule
  ],
  declarations: [PublicAreaPage]
})
export class PublicAreaPageModule {}
