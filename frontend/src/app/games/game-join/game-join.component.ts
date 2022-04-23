import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, shareReplay } from 'rxjs';
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
  selector: 'app-game-join',
  templateUrl: './game-join.component.html',
  styleUrls: ['./game-join.component.scss'],
})
export class GameJoinComponent implements OnInit {
  readonly gameId$ = this.route.paramMap.pipe(
    map((params) => BigInt(params.get('gameId')!)),
    shareReplay(1),
  );

  @ViewChild(FleetSetupBoardComponent, { static: true })
  fleetSetupBoard!: FleetSetupBoardComponent;

  constructor(
    private readonly wallet: WalletService,
    private readonly gameProver: GameProverService,
    private readonly gameContract: GameContractService,
    private readonly gameStorage: GameStorageService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {}

  async joinGame(): Promise<void> {
    const playerAddress = await firstValueFrom(this.wallet.address$);

    const ships = await firstValueFrom(
      this.fleetSetupBoard.fleetConfiguration$,
    ).then((value) => value as ShipConfigurations);

    const trapdoor = randomBigInt();

    const proof = await this.gameProver.generateBoardSetupProof(
      ships,
      trapdoor,
    );

    const gameId = await firstValueFrom(this.gameId$);
    await this.gameContract.joinGame(gameId, proof);

    await this.gameStorage.storeGameBoard(gameId, playerAddress!, {
      ships,
      trapdoor,
      hash: proof.boardHash,
    });

    await this.router.navigate(['games', gameId, 'play']);
  }
}
