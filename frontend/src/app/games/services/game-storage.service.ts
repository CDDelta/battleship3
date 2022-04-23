import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ShipConfigurations } from './game-prover.service';

export interface GameBoard {
  ships: ShipConfigurations;
  trapdoor: bigint;
  hash: bigint;
}

@Injectable({
  providedIn: 'root',
})
export class GameStorageService {
  readonly storage: Storage;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.storage = document.defaultView!.localStorage;
  }

  async getGameBoard(
    gameId: bigint,
    playerAddress: string,
  ): Promise<GameBoard | undefined> {
    const boardJson = this.storage.getItem(`${gameId} - ${playerAddress}`);

    if (!boardJson) {
      return undefined;
    }

    return this.deserializeBoard(boardJson);
  }

  async storeGameBoard(
    gameId: bigint,
    playerAddress: string,
    board: GameBoard,
  ) {
    this.storage.setItem(
      `${gameId} - ${playerAddress}`,
      this.serializeBoard(board),
    );
  }

  private serializeBoard({ ships, trapdoor, hash }: GameBoard): string {
    const stringBigIntBoard = {
      ships: ships.map((ship) => ship.map((value) => value.toString())),
      trapdoor: trapdoor.toString(),
      hash: hash.toString(),
    };

    return JSON.stringify(stringBigIntBoard);
  }

  private deserializeBoard(boardJson: string): GameBoard {
    const stringBigIntBoard = JSON.parse(boardJson);

    return {
      ships: stringBigIntBoard.ships.map((ship: string[]) =>
        ship.map((value) => BigInt(value)),
      ),
      trapdoor: BigInt(stringBigIntBoard.trapdoor),
      hash: BigInt(stringBigIntBoard.hash),
    };
  }
}
