import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { WalletService } from 'src/app/services/wallet.service';
import { FleetSetupBoardComponent } from '../components/fleet-setup-board/fleet-setup-board.component';
import { GameContractService } from '../services/game-contract.service';
import {
  GameProverService,
  ShipConfigurations,
} from '../services/game-prover.service';
import { GameStorageService } from '../services/game-storage.service';
import { randomBigInt } from '../utils';

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.scss'],
})
export class GameCreateComponent implements OnInit {
  @ViewChild(FleetSetupBoardComponent, { static: true })
  readonly fleetSetupBoard!: FleetSetupBoardComponent;

  readonly playerCreatingGame$ = new BehaviorSubject(false);

  constructor(
    private readonly wallet: WalletService,
    private readonly gameProver: GameProverService,
    private readonly gameContract: GameContractService,
    private readonly gameStorage: GameStorageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {}

  async createGame(): Promise<void> {
    const playerAlreadyCreatingGame = await firstValueFrom(
      this.playerCreatingGame$,
    );
    if (playerAlreadyCreatingGame) {
      return;
    }

    this.playerCreatingGame$.next(true);

    try {
      const playerAddress = await firstValueFrom(this.wallet.address$);

      const ships = await firstValueFrom(
        this.fleetSetupBoard.fleetConfiguration$,
      ).then((value) => value as ShipConfigurations);

      const trapdoor = randomBigInt();

      const proof = await this.gameProver.generateBoardSetupProof(
        ships,
        trapdoor,
      );

      const gameId = await this.gameContract.startGame(proof);

      await this.gameStorage.storeGameBoard(gameId, playerAddress!, {
        ships,
        trapdoor,
        hash: proof.boardHash,
      });

      await this.router.navigate(['games', gameId, 'play']);
    } finally {
      this.playerCreatingGame$.next(false);
    }
  }
}
