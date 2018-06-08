import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppPreloadingStrategy } from './app-preloading-strategy';

import { HomeComponent } from './home/home.component';
import { UiComponent } from './ui/ui.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {
        path: 'simulation',
        loadChildren: './ui/ui.module#UiModule',
        data: { preload: false }
    },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    providers: [AppPreloadingStrategy],
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: AppPreloadingStrategy
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
