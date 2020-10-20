import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StageViewComponent} from './public-area/public-task-view/stage-view/stage-view.component';
import {PhotoViewComponent} from './public-area/public-task-view/stage-view/photo-view/photo-view.component';
import {AddTaskComponent} from './user-area/add-task/add-task.component';
import {ImagePickerComponent} from './shared/image-picker/image-picker.component';
import {TopMenuComponent} from './shared/top-menu/top-menu.component';



@NgModule({
  declarations: [StageViewComponent,PhotoViewComponent,ImagePickerComponent,TopMenuComponent],
  imports: [
    CommonModule

  ],
    exports:[StageViewComponent,ImagePickerComponent,TopMenuComponent],
    entryComponents:[StageViewComponent,PhotoViewComponent]
})
export class ComponentsModule { }
