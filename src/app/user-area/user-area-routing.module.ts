import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAreaPage } from './user-area.page';

const routes: Routes = [
    {
        path: '',
        children:[
            {path:'',component: UserAreaPage},
            {path:'taskId/:id',loadChildren:'./user-task-view/user-task-view.module#UserTaskViewPageModule'},
            {path:'editProfile',loadChildren:'./profile-edit/profile-edit.module#ProfileEditPageModule'},
            {path:'editPassword',loadChildren:'./edit-password/edit-password.module#EditPasswordPageModule'}

        ]
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAreaPageRoutingModule {}
