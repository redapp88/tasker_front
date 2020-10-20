import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProfileEditPageRoutingModule} from './profile-edit-routing.module';

import {ProfileEditPage} from './profile-edit.page';
import {TopMenuComponent} from '../../shared/top-menu/top-menu.component';
import {ComponentsModule} from '../../components.module';
import {UserAreaPageModule} from '../user-area.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ProfileEditPageRoutingModule
    ],
    declarations: [ProfileEditPage]
})
export class ProfileEditPageModule {
}
