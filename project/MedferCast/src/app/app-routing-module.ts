import { ViewComponent } from './view/view.component';
import { RepositoryComponent } from './repository/repository.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', component: ViewComponent },
    { path: 'repository', component: RepositoryComponent }
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}
export const routingComponents = [ViewComponent, RepositoryComponent];