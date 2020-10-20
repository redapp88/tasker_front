import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicTaskViewPage } from './public-task-view.page';

const routes: Routes = [
  {
    path: '',
    component: PublicTaskViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicTaskViewPageRoutingModule {}
