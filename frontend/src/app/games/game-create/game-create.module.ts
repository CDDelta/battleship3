import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameCreateComponent } from './game-create.component';
import { FleetSetupBoardModule } from '../components/fleet-setup-board/fleet-setup-board.module';

@NgModule({
  declarations: [
    GameCreateComponent
  ],
  imports: [
    CommonModule,
    FleetSetupBoardModule
  ]
})
export class GameCreateModule { }
