export function randomBigInt(): bigint {
  return BigInt(Math.floor(Math.random() * 10 ** 8));
}
