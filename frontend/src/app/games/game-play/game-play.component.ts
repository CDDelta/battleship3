import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  firstValueFrom,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { WalletService } from 'src/app/services/wallet.service';
import {
  GamePlayGQL,
  GamePlayQuery,
  GameStatus,
  ShotStatus,
} from 'src/graphql/generated';
import { GameContractService } from '../services/game-contract.service';
import { GameProverService } from '../services/game-prover.service';
import {
  GAME_BOARD_WIDTH,
  GAME_COLUMN_NAMES,
  GAME_ROW_NAMES,
  GAME_SHIPS,
  GAME_STARTING_SHIP_CELL_COUNT,
  Ship,
} from '../game-constants';
import { GameStorageService } from '../services/game-storage.service';

enum TurnStatus {
  WaitingForOpponent,
  PlayerTurn,
  OpponentTurn,
  PlayerWon,
  PlayerLost,
}

type Game = NonNullable<GamePlayQuery['game']>;
type Shot = NonNullable<Game['shots']>[number];

const SHOT_HIT_PREDICATE = (shot: Shot) =>
  shot.status !== ShotStatus.Miss && shot.status !== ShotStatus.Unknown;

function mapShotsToBoard(shots: Shot[]): Shot[][] {
  const board: Shot[][] = [];

  for (let i = 0; i < 10; i++) {
    board.push(new Array<Shot>(10));
  }

  for (const shot of shots) {
    board[shot.x][shot.y] = shot;
  }

  return board;
}

function shotCoordinatesToIndex(x: number, y: number): bigint {
  return BigInt(x + y * GAME_BOARD_WIDTH);
}

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss'],
})
export class GamePlayComponent implements OnInit {
  readonly TurnStatus = TurnStatus;
  readonly ShotStatus = ShotStatus;

  readonly gameId$ = this.route.paramMap.pipe(
    map((params) => params.get('gameId')!),
    shareReplay(1),
  );

  readonly game$ = this.gameId$.pipe(
    switchMap(
      (gameId) =>
        this.gamePlayGql.watch(
          {
            gameId,
          },
          {
            pollInterval: 1000,
          },
        ).valueChanges,
    ),
    map(({ data }) => data?.game as Game),
    filter((game) => !!game),
    shareReplay(1),
  );

  readonly isHost$ = combineLatest([this.wallet.address$, this.game$]).pipe(
    map(
      ([playerAddress, game]) =>
        game.startedBy.toLowerCase() === playerAddress?.toLowerCase(),
    ),
    shareReplay(1),
  );

  readonly turnStatus$ = combineLatest([
    this.wallet.address$,
    this.game$,
    this.isHost$,
  ]).pipe(
    map(([playerAddress, game, isHost]) => {
      switch (game.status) {
        case GameStatus.Started:
          return TurnStatus.WaitingForOpponent;
        case GameStatus.Joined:
          return game.turn % 2 === (isHost ? 0 : 1)
            ? TurnStatus.PlayerTurn
            : TurnStatus.OpponentTurn;
        case GameStatus.Over:
          const playerWon =
            game.wonBy.toLowerCase() === playerAddress?.toLowerCase();
          return playerWon ? TurnStatus.PlayerWon : TurnStatus.PlayerLost;
        default:
          throw new Error('Invalid game status!');
      }
    }),
    shareReplay(1),
  );

  readonly isPlayerTurn$ = this.turnStatus$.pipe(
    map((turnStatus) => turnStatus === TurnStatus.PlayerTurn),
    shareReplay(1),
  );

  readonly playerBoard$ = combineLatest([
    this.gameId$,
    this.wallet.address$,
  ]).pipe(
    switchMap(([gameId, playerAddress]) =>
      this.gameStorage.getGameBoard(BigInt(gameId), playerAddress!),
    ),
    shareReplay(1),
  );

  readonly playerShipOccupancyBoard$ = this.playerBoard$.pipe(
    map((board) => {
      const occupancyBoard = [];
      for (let i = 0; i < GAME_BOARD_WIDTH; i++) {
        occupancyBoard.push(
          new Array<Ship | undefined>(GAME_BOARD_WIDTH).fill(undefined),
        );
      }

      if (!board) {
        return occupancyBoard;
      }

      for (let i = 0; i < 5; i++) {
        const ship = board.ships[i];
        const shipLength = GAME_SHIPS[i].length;

        const shipStartX = Number(ship[0]);
        const shipStartY = Number(ship[1]);
        const shipIsHorizontal = ship[2] === 0n;

        const shipAxisStart = shipIsHorizontal ? shipStartX : shipStartY;
        const shipAxisEnd = shipAxisStart + shipLength - 1;

        for (
          let j = shipIsHorizontal ? shipStartX : shipStartY;
          j < shipAxisEnd + 1;
          j++
        ) {
          const x = shipIsHorizontal ? j : shipStartX;
          const y = shipIsHorizontal ? shipStartY : j;
          occupancyBoard[x][y] = GAME_SHIPS[i];
        }
      }

      return occupancyBoard;
    }),
  );

  readonly playerFiringShot$ = new BehaviorSubject(false);

  readonly playerShots$ = combineLatest([this.game$, this.isHost$]).pipe(
    map(
      ([game, isHost]) =>
        game.shots?.filter((shot) => shot.turn % 2 === (isHost ? 0 : 1)) || [],
    ),
    shareReplay(1),
  );

  readonly opponentShots$ = combineLatest([this.game$, this.isHost$]).pipe(
    map(
      ([game, isHost]) =>
        game.shots?.filter((shot) => shot.turn % 2 === (isHost ? 1 : 0)) || [],
    ),
    shareReplay(1),
  );

  readonly playerHitShots$ = this.playerShots$.pipe(
    map((shots) => shots?.filter(SHOT_HIT_PREDICATE)),
    shareReplay(1),
  );

  readonly opponentHitShots$ = this.opponentShots$.pipe(
    map((shots) => shots?.filter(SHOT_HIT_PREDICATE)),
    shareReplay(1),
  );

  readonly playerShotsBoard$ = this.playerShots$.pipe(
    map(mapShotsToBoard),
    shareReplay(1),
  );

  readonly opponentShotsBoard$ = this.opponentShots$.pipe(
    map(mapShotsToBoard),
    shareReplay(1),
  );

  readonly playerCellsLeft$ = this.opponentHitShots$.pipe(
    map((shots) => GAME_STARTING_SHIP_CELL_COUNT - shots?.length),
    shareReplay(1),
  );

  readonly opponentCellsLeft$ = this.playerHitShots$.pipe(
    map((shots) => GAME_STARTING_SHIP_CELL_COUNT - shots?.length),
    shareReplay(1),
  );

  readonly lastGameShot$ = this.game$.pipe(
    map((game) =>
      game.shots && game.shots.length > 0
        ? game.shots[game.shots.length - 1]
        : undefined,
    ),
    shareReplay(1),
  );

  private readonly playerShotSelection = new SelectionModel<bigint>();

  readonly playerCanFireShot$ = combineLatest([
    this.isPlayerTurn$,
    this.playerShotSelection.changed.asObservable(),
  ]).pipe(
    map(
      ([isPlayerTurn, playerSelectionChange]) =>
        isPlayerTurn && playerSelectionChange.source.hasValue(),
    ),
  );

  columns = GAME_COLUMN_NAMES;
  rows = GAME_ROW_NAMES;

  constructor(
    private readonly wallet: WalletService,
    private readonly gamePlayGql: GamePlayGQL,
    private readonly gameProver: GameProverService,
    private readonly gameContract: GameContractService,
    private readonly gameStorage: GameStorageService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {}

  async fireShot(): Promise<void> {
    const playerAlreadyFiring = await firstValueFrom(this.playerFiringShot$);
    if (playerAlreadyFiring) {
      return;
    }

    this.playerFiringShot$.next(true);

    try {
      const isFirstTurn = await firstValueFrom(this.game$).then(
        (game) => game?.turn === 0,
      );

      const gameId = await firstValueFrom(this.gameId$).then((v) => BigInt(v));
      const currentTurnShotIndex = this.playerShotSelection.selected[0];

      if (isFirstTurn) {
        await this.gameContract.playFirstTurn(gameId, currentTurnShotIndex);
      } else {
        const playerBoard = await firstValueFrom(this.playerBoard$).then(
          (v) => v!,
        );
        const lastShot = await firstValueFrom(this.lastGameShot$).then(
          (v) => v!,
        );
        const prevTurnShotIndex = shotCoordinatesToIndex(
          lastShot.x,
          lastShot.y,
        );

        const proof = await this.gameProver.generateFireShotProof(
          playerBoard.ships,
          playerBoard.trapdoor,
          playerBoard.hash,
          prevTurnShotIndex,
        );

        await this.gameContract.playTurn(
          gameId,
          prevTurnShotIndex,
          currentTurnShotIndex,
          proof,
        );
      }

      this.playerShotSelection.clear();
    } finally {
      this.playerFiringShot$.next(false);
    }
  }

  selectPlayerTurnShotLocation(x: number, y: number): void {
    this.playerShotSelection.toggle(shotCoordinatesToIndex(x, y));
  }

  playerShotLocationIsSelected(x: number, y: number): boolean {
    return this.playerShotSelection.isSelected(shotCoordinatesToIndex(x, y));
  }
}
