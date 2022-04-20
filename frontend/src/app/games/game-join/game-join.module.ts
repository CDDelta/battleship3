import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameJoinComponent } from './game-join.component';
import { FleetSetupBoardModule } from '../components/fleet-setup-board/fleet-setup-board.module';

@NgModule({
  declarations: [
    GameJoinComponent
  ],
  imports: [
    CommonModule,
    FleetSetupBoardModule
  ]
})
export class GameJoinModule { }
