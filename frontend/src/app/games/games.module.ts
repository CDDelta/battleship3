import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { GamesListModule } from './games-list/games-list.module';
import { GameCreateModule } from './game-create/game-create.module';
import { GameJoinModule } from './game-join/game-join.module';
import { GamePlayModule } from './game-play/game-play.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GamesListModule,
    GameCreateModule,
    GameJoinModule,
    GamePlayModule,
    GamesRoutingModule
  ]
})
export class GamesModule { }
