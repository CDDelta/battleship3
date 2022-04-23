export const GAME_COLUMN_NAMES = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
];
export const GAME_ROW_NAMES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const GAME_BOARD_WIDTH = 10;

export enum ShipType {
  Carrier = 'CA',
  Battleship = 'B',
  Cruiser = 'CR',
  Submarine = 'S',
  Destroyer = 'D',
}

export interface Ship {
  id: ShipType;
  name: string;
  length: number;
}

export const GAME_SHIPS: Ship[] = [
  {
    id: ShipType.Carrier,
    name: 'Carrier',
    length: 5,
  },
  {
    id: ShipType.Battleship,
    name: 'Battleship',
    length: 4,
  },
  {
    id: ShipType.Cruiser,
    name: 'Cruiser',
    length: 3,
  },
  {
    id: ShipType.Submarine,
    name: 'Submarine',
    length: 3,
  },
  {
    id: ShipType.Destroyer,
    name: 'Destroyer',
    length: 2,
  },
];

export const GAME_STARTING_SHIP_CELL_COUNT = 17;
