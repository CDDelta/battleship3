import { ByteArray, crypto } from '@graphprotocol/graph-ts';

export function getShotId(gameId: string, turn: number): string {
  const stringId = gameId + turn.toString().padStart(3, '0');
  return crypto.keccak256(ByteArray.fromUTF8(stringId)).toHex();
}
