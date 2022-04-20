import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameCreateComponent } from './game-create/game-create.component';
import { GameJoinComponent } from './game-join/game-join.component';
import { GamePlayComponent } from './game-play/game-play.component';
import { GamesListComponent } from './games-list/games-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: GamesListComponent,
  },
  {
    path: 'create',
    component: GameCreateComponent,
  },
  {
    path: ':gameId/join',
    component: GameJoinComponent,
  },
  {
    path: ':gameId/play',
    component: GamePlayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
