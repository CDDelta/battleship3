import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, shareReplay } from 'rxjs';
import { GameContractService } from '../services/game-contract.service';
import { GameProverService } from '../services/game-prover.service';

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

  constructor(
    private readonly gameProver: GameProverService,
    private readonly gameContract: GameContractService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {}

  async joinGame(): Promise<void> {
    const proof = await this.gameProver.generateBoardSetupProof(
      [
        [0n, 0n, 1n],
        [1n, 0n, 1n],
        [2n, 0n, 1n],
        [3n, 0n, 1n],
        [4n, 0n, 1n],
      ],
      123121n,
    );

    const gameId = await firstValueFrom(this.gameId$);
    await this.gameContract.joinGame(gameId, proof);

    await this.router.navigate(['games', gameId, 'play']);
  }
}
