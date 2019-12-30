import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { PostsModule } from '../../posts/modules/posts.module';

import { HomeComponent } from '../components/container/home/home.component';

const homeRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  { path: 'posts', loadChildren: () => PostsModule }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [RouterModule.forChild(homeRoutes), CommonModule, PostsModule]
})
export class HomeModule {}
