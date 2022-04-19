pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/mimcsponge.circom";

include "./templates/bitcounter.circom";
include "./templates/shiphit.circom";

template HitCounter() {
    // The x, y, z of ship positions.
    signal input ships[5][3];
    // A user held secret that prevents others from brute forcing the board's configuration
    signal input trapdoor;
    signal input hash;

    // The integer representation of the player's attempted shots.
    signal input shots;

    signal output hitCounts[5];

    // The length of each ship in the order used.
    var lengths[5] = [5, 4, 3, 3, 2];

    component shotsBitlist = Num2Bits_strict();
    shotsBitlist.in <== shots;

    // Verify that the specified ship configuration matches with that of the committed hash.
    component hasher = MiMCSponge(16, 220, 1);
    hasher.k <== 0;
    hasher.ins[15] <== trapdoor;
    for (var i = 0; i < 15; i++) {
        hasher.ins[i] <== ships[i \ 3][i % 3];
    }

    hasher.outs[0] === hash;

    component shipHits[100][5];
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 5; j++) {
            shipHits[i][j] = ShipHit(lengths[j]);
            shipHits[i][j].ship[0] <== ships[j][0];
            shipHits[i][j].ship[1] <== ships[j][1];
            shipHits[i][j].ship[2] <== ships[j][2];
            shipHits[i][j].shot[0] <== i \ 10;
            shipHits[i][j].shot[1] <== i % 10;
        }
    }

    component hitCounters[5];
    for (var i = 0; i < 5; i++) {
        hitCounters[i] = BitCounter(128);

        for (var j = 0; j < 100; j++) {
            hitCounters[i].ins[j] <== shipHits[j][i].hit;
        }

        for (var j = 100; j < 128; j++) {
            hitCounters[i].ins[j] <== 0;
        }

        hitCounts[i] <== hitCounters[i].out;
    }
}

component main { public [hash, shots] } = HitCounter();