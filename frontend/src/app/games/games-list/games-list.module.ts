import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesListComponent } from './games-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GamesListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class GamesListModule { }
