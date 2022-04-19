pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/mimcsponge.circom";

include "./templates/shiphit.circom";

template FireShot() {
    // The x, y, z of ship positions.
    signal input ships[5][3];
    // A user held secret that prevents others from brute forcing the board's configuration
    signal input trapdoor;
    signal input hash;

    // The x, y coordinate of the shot.
    signal input shot[2];

    signal output hits[5];

    // The length of each ship in the order used.
    var lengths[5] = [5, 4, 3, 3, 2];

    // Verify that the specified ship configuration matches with that of the committed hash.
    component hasher = MiMCSponge(16, 220, 1);
    hasher.k <== 0;
    hasher.ins[15] <== trapdoor;
    for (var i = 0; i < 15; i++) {
        hasher.ins[i] <== ships[i \ 3][i % 3];
    }

    hasher.outs[0] === hash;

    // Compute which ship the shot hit.
    component shipHits[5];
    for (var i = 0; i < 5; i++) {
        shipHits[i] = ShipHit(lengths[i]);
        shipHits[i].ship[0] <== ships[i][0];
        shipHits[i].ship[1] <== ships[i][1];
        shipHits[i].ship[2] <== ships[i][2];
        shipHits[i].shot[0] <== shot[0];
        shipHits[i].shot[1] <== shot[1];

        hits[i] <== shipHits[i].hit;
    }
}

component main { public [hash, shot] } = FireShot();