import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameContractService } from '../services/game-contract.service';
import { GameProverService } from '../services/game-prover.service';

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.scss'],
})
export class GameCreateComponent implements OnInit {
  constructor(
    private readonly gameProver: GameProverService,
    private readonly gameContract: GameContractService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {}

  async createGame(): Promise<void> {
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

    const gameId = await this.gameContract.startGame(proof);

    await this.router.navigate(['games', gameId, 'play']);
  }
}
