import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardUsers} from './login/authUsers.guard';
import {AuthGuardManagers} from './login/authManagers.guard';

const routes: Routes = [
    {path: '', redirectTo: 'publicArea', pathMatch: 'full'},
    {path: 'publicArea', loadChildren: './public-area/public-area.module#PublicAreaPageModule'},
    {path: 'home', loadChildren: './home/home.module#HomePageModule', canLoad: [AuthGuardUsers]},
    {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
    {path: 'userArea', loadChildren: './user-area/user-area.module#UserAreaPageModule', canLoad: [AuthGuardUsers]},
    {path: 'adminArea', loadChildren: './admin-area/admin-area.module#AdminAreaPageModule', canLoad: [AuthGuardManagers]},
    {path: 'contact', loadChildren: './contact/contact.module#ContactPageModule'},
    {path: 'guide', loadChildren: './guide/guide.module#GuidePageModule'},
    {path: 'forgetPassword', loadChildren: './forget-password/forget-password.module#ForgetPasswordPageModule'},


];


@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
