import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';
import {
  GAME_BOARD_WIDTH,
  GAME_COLUMN_NAMES,
  GAME_ROW_NAMES,
  GAME_SHIPS,
  Ship,
  ShipType,
} from '../../game-constants';
import { ShipConfiguration } from '../../services/game-prover.service';

@Component({
  selector: 'app-fleet-setup-board',
  templateUrl: './fleet-setup-board.component.html',
  styleUrls: ['./fleet-setup-board.component.scss'],
})
export class FleetSetupBoardComponent implements OnInit {
  readonly ShipType = ShipType;

  readonly ships = GAME_SHIPS;
  readonly columns = GAME_COLUMN_NAMES;
  readonly rows = GAME_ROW_NAMES;

  readonly fleetConfiguration$ = new BehaviorSubject<
    [
      ShipConfiguration | undefined,
      ShipConfiguration | undefined,
      ShipConfiguration | undefined,
      ShipConfiguration | undefined,
      ShipConfiguration | undefined,
    ]
  >([undefined, undefined, undefined, undefined, undefined]);

  readonly fleetComplete$ = this.fleetConfiguration$.pipe(
    map((fleet) => fleet.every((ship) => !!ship)),
  );

  occupancyBoard: (Ship | undefined)[][];

  shipSelection = new SelectionModel<Ship>();
  placeShipsHorizontally = true;

  constructor() {
    this.occupancyBoard = [];
    for (let i = 0; i < GAME_BOARD_WIDTH; i++) {
      this.occupancyBoard.push(
        new Array<Ship | undefined>(GAME_BOARD_WIDTH).fill(undefined),
      );
    }
  }

  ngOnInit(): void {}

  placeSelectedShip(x: number, y: number) {
    const ship = this.shipSelection.selected[0];

    if (this.shipPlacementOnBoardInvalid(ship, x, y)) {
      return;
    }

    this.removeShipFromBoard(ship);
    this.placeShip(ship, x, y);

    this.shipSelection.clear();
  }

  toggleShipPlacementOrientation() {
    this.placeShipsHorizontally = !this.placeShipsHorizontally;
  }

  hasPlacedShip(ship: Ship): boolean {
    const shipIndex = this.ships.indexOf(ship);
    return !!this.fleetConfiguration$.value[shipIndex];
  }

  /**
   * Returns true if the placement of the specified ship conflicts with placed ship of another type or
   * if it goes out of bounds of the board.
   */
  private shipPlacementOnBoardInvalid(
    ship: Ship,
    x: number,
    y: number,
  ): boolean {
    const shipEndAlongAxis =
      (this.placeShipsHorizontally ? x : y) + ship.length - 1;
    if (shipEndAlongAxis >= GAME_BOARD_WIDTH) {
      return true;
    }

    if (this.placeShipsHorizontally) {
      for (let i = x; i < shipEndAlongAxis + 1; i++) {
        if (
          this.occupancyBoard[i][y] !== undefined &&
          this.occupancyBoard[i][y] !== ship
        ) {
          return true;
        }
      }
    } else {
      for (let i = y; i < shipEndAlongAxis + 1; i++) {
        if (
          this.occupancyBoard[x][i] !== undefined &&
          this.occupancyBoard[x][i] !== ship
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private placeShip(ship: Ship, x: number, y: number): void {
    const shipIndex = this.ships.indexOf(ship);
    const shipConfiguration = this.fleetConfiguration$.value;
    shipConfiguration[shipIndex] = [
      BigInt(x),
      BigInt(y),
      this.placeShipsHorizontally ? BigInt(0) : BigInt(1),
    ];
    this.fleetConfiguration$.next(shipConfiguration);

    if (this.placeShipsHorizontally) {
      for (let i = x; i < x + ship.length; i++) {
        this.occupancyBoard[i][y] = ship;
      }
    } else {
      for (let i = y; i < y + ship.length; i++) {
        this.occupancyBoard[x][i] = ship;
      }
    }
  }

  private removeShipFromBoard(ship: Ship): void {
    const shipIndex = this.ships.indexOf(ship);
    const shipConfiguration = this.fleetConfiguration$.value;
    shipConfiguration[shipIndex] = undefined;
    this.fleetConfiguration$.next(shipConfiguration);

    for (let x = 0; x < GAME_BOARD_WIDTH; x++) {
      for (let y = 0; y < GAME_BOARD_WIDTH; y++) {
        if (this.occupancyBoard[x][y] === ship) {
          this.occupancyBoard[x][y] = undefined;
        }
      }
    }
  }
}
