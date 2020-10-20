import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTaskViewPage } from './user-task-view.page';

const routes: Routes = [
  {
    path: '',
    component: UserTaskViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTaskViewPageRoutingModule {}
