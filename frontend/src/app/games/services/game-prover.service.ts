import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

const CIRCUIT_PATH_PREFIX = 'assets/circuits';

export type ShipConfiguration = [bigint, bigint, bigint];
export type ShipConfigurations = [
  ShipConfiguration,
  ShipConfiguration,
  ShipConfiguration,
  ShipConfiguration,
  ShipConfiguration,
];

interface Groth16Proof {
  pi_a: [bigint, bigint];
  pi_b: [[bigint, bigint], [bigint, bigint]];
  pi_c: [bigint, bigint];
}

export interface BoardSetupProof extends Groth16Proof {
  boardHash: bigint;
}

export interface FireShotProof extends Groth16Proof {
  hitShipId: bigint;
}

@Injectable({
  providedIn: 'root',
})
export class GameProverService {
  private readonly snarkjs: any;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.snarkjs = (document.defaultView as any).snarkjs;
  }

  async generateBoardSetupProof(
    ships: ShipConfigurations,
    trapdoor: bigint,
  ): Promise<BoardSetupProof> {
    const { proof, publicSignals } = await this.snarkjs.groth16.fullProve(
      { ships, trapdoor },
      `${CIRCUIT_PATH_PREFIX}/boardsetup/boardsetup.wasm`,
      `${CIRCUIT_PATH_PREFIX}/boardsetup/boardsetup_final.zkey`,
    );

    return {
      ...this.parseGroth16Proof(proof),
      boardHash: BigInt(publicSignals[0]),
    };
  }

  async generateFireShotProof(
    ships: ShipConfigurations,
    trapdoor: bigint,
    hash: bigint,
    shotIndex: bigint,
  ): Promise<FireShotProof> {
    const { proof, publicSignals } = await this.snarkjs.groth16.fullProve(
      { ships, trapdoor, hash, shotIndex },
      `${CIRCUIT_PATH_PREFIX}/fireshot/fireshot.wasm`,
      `${CIRCUIT_PATH_PREFIX}/fireshot/fireshot_final.zkey`,
    );

    return {
      ...this.parseGroth16Proof(proof),
      hitShipId: BigInt(publicSignals[0]),
    };
  }

  private parseGroth16Proof({ pi_a, pi_b, pi_c }: any): Groth16Proof {
    return {
      pi_a: [BigInt(pi_a[0]), BigInt(pi_a[1])],
      pi_b: [
        [BigInt(pi_b[0][1]), BigInt(pi_b[0][0])],
        [BigInt(pi_b[1][1]), BigInt(pi_b[1][0])],
      ],
      pi_c: [BigInt(pi_c[0]), BigInt(pi_c[1])],
    };
  }
}
