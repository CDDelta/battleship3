import { log } from "@graphprotocol/graph-ts";
import {
  Joined,
  ShotFired,
  ShotLanded,
  Started,
  Won,
} from "../types/Game/Game";
import { Game, Shot } from "../types/schema";

export function handleGameStarted(event: Started): void {
  const gameId = event.params._gameId.toString();

  log.info("Game started: {}", [gameId]);

  const game = new Game(gameId);
  game.status = "STARTED";
  game.startedBy = event.params._by;
  game.save();
}

export function handleGameJoined(event: Joined): void {
  const gameId = event.params._gameId.toString();

  log.info("Game joined: {}", [gameId]);

  const game = Game.load(gameId);

  if (!game) {
    throw new Error("Game could not be found!");
  }

  game.status = "JOINED";
  game.joinedBy = event.params._by;
  game.save();
}

export function handleShotFired(event: ShotFired): void {
  const gameId = event.params._gameId.toString();

  log.info("Shot fired: {}", [gameId]);

  const game = Game.load(gameId);

  if (!game) {
    throw new Error("Game could not be found!");
  }

  const shotId = gameId + game.turn.toString();
  const shot = new Shot(shotId);

  shot.game = gameId;
  shot.turn = game.turn;
  shot.status = "UNKNOWN";
  shot.x = event.params._shotIndex % 10;
  shot.y = event.params._shotIndex / 10;
  shot.save();
}

export function handleShotLanded(event: ShotLanded): void {
  const gameId = event.params._gameId.toString();

  log.info("Shot landed: {}", [gameId]);

  const game = Game.load(gameId);

  if (!game) {
    throw new Error("Game could not be found!");
  }

  const shotId = gameId + game.turn.toString();
  const shot = Shot.load(shotId);

  if (!shot) {
    throw new Error("Shot could not be found!");
  }

  switch (event.params._shipId) {
    case 0:
      shot.status = "MISS";
      break;
    case 1:
      shot.status = "CARRIER";
      break;
    case 2:
      shot.status = "BATTLESHIP";
      break;
    case 4:
      shot.status = "CRUISER";
      break;
    case 8:
      shot.status = "SUBMARINE";
      break;
    case 16:
      shot.status = "DESTROYER";
      break;
    default:
      throw new Error("Invalid ship id!");
  }

  shot.save();

  game.turn += 1;
  game.save();
}

export function handleGameWon(event: Won): void {
  const gameId = event.params._gameId.toString();

  log.info("Game won: {}", [gameId]);

  const game = Game.load(gameId);

  if (!game) {
    throw new Error("Game could not be found!");
  }

  game.status = "OVER";
  game.wonBy = event.params._by;
  game.save();
}
