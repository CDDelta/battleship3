import { Injectable } from '@angular/core';
import { firstValueFrom, map, shareReplay } from 'rxjs';
import { WalletService } from 'src/app/services/wallet.service';
import { Game__factory } from 'src/contracts';
import { StartedEvent } from 'src/contracts/IGame';
import { environment } from 'src/environments/environment';
import { BoardSetupProof, FireShotProof } from './game-prover.service';

const TX_CONFIRMATION_COUNT = 1;

@Injectable({
  providedIn: 'root',
})
export class GameContractService {
  private readonly gameContract$ = this.wallet.signer$.pipe(
    map((signer) =>
      Game__factory.connect(environment.gameContractAddress, signer),
    ),
    shareReplay(1),
  );

  constructor(private readonly wallet: WalletService) {}

  async startGame({
    boardHash,
    pi_a,
    pi_b,
    pi_c,
  }: BoardSetupProof): Promise<bigint> {
    const gameContract = await firstValueFrom(this.gameContract$);

    const receipt = await gameContract
      .startGame(boardHash, pi_a, pi_b, pi_c)
      .then((tx) => tx.wait(TX_CONFIRMATION_COUNT));

    const startedEvent = receipt.events?.find(
      (event) => event.event === 'Started',
    ) as StartedEvent | undefined;

    if (!startedEvent) {
      throw Error('Game started event not found!');
    }

    return startedEvent.args._gameId.toBigInt();
  }

  async joinGame(
    gameId: bigint,
    { boardHash, pi_a, pi_b, pi_c }: BoardSetupProof,
  ) {
    const gameContract = await firstValueFrom(this.gameContract$);

    await gameContract
      .joinGame(gameId, boardHash, pi_a, pi_b, pi_c)
      .then((tx) => tx.wait(TX_CONFIRMATION_COUNT));
  }

  async playFirstTurn(gameId: bigint, turnShotIndex: bigint): Promise<void> {
    const gameContract = await firstValueFrom(this.gameContract$);

    await gameContract
      .playFirstTurn(gameId, turnShotIndex)
      .then((tx) => tx.wait(TX_CONFIRMATION_COUNT));
  }

  async playTurn(
    gameId: bigint,
    prevTurnShotIndex: bigint,
    turnShotIndex: bigint,
    { hitShipId, pi_a, pi_b, pi_c }: FireShotProof,
  ) {
    const gameContract = await firstValueFrom(this.gameContract$);

    await gameContract
      .playTurn(
        gameId,
        hitShipId,
        prevTurnShotIndex,
        turnShotIndex,
        pi_a,
        pi_b,
        pi_c,
      )
      .then((tx) => tx.wait(TX_CONFIRMATION_COUNT));
  }
}
