import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicAreaPage } from './public-area.page';
import {PublicTaskViewPageModule} from './public-task-view/public-task-view.module';

const routes: Routes = [
    {
        path: '',
        children:[
            {path:'',component: PublicAreaPage},
            {path:'taskId/:id',loadChildren:'./public-task-view/public-task-view.module#PublicTaskViewPageModule'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PublicAreaPageRoutingModule {}
