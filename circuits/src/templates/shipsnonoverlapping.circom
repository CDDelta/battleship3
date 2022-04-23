pragma circom 2.0.0;

include "../../../node_modules/circomlib/circuits/comparators.circom";

template ShipsNonoverlapping(length1, length2) {
    signal input ships[2][3];

    // ship1.x >= ship2.x
    component ship1StartXGeqShip2StartX = GreaterEqThan(4);
    ship1StartXGeqShip2StartX.in[0] <== ships[0][0];
    ship1StartXGeqShip2StartX.in[1] <== ships[1][0];

    // ship2.x >= ship1.x
    component ship2StartXGeqShip1StartX = GreaterEqThan(4);
    ship2StartXGeqShip1StartX.in[0] <== ships[1][0];
    ship2StartXGeqShip1StartX.in[1] <== ships[0][0];

    // ship1.x == ship2.x
    signal ship1StartXEqShip2StartX;
    ship1StartXEqShip2StartX <== ship1StartXGeqShip2StartX.out * ship2StartXGeqShip1StartX.out;

    // ship2.y >= ship1.y
    component ship2StartYGeqShip1StartY = GreaterEqThan(4);
    ship2StartYGeqShip1StartY.in[0] <== ships[1][1];
    ship2StartYGeqShip1StartY.in[1] <== ships[0][1];

    // ship1.y >= ship2.y
    component ship1StartYGeqShip2StartY = GreaterEqThan(4);
    ship1StartYGeqShip2StartY.in[0] <== ships[0][1];
    ship1StartYGeqShip2StartY.in[1] <== ships[1][1];

    // ship1.y == ship2.y
    signal shipStartYEq;
    shipStartYEq <== ship2StartYGeqShip1StartY.out * ship1StartYGeqShip2StartY.out;

    // ship2.x <= ship1.x + length - 1
    component ship2StartXLeqShip1End = LessThan(4);
    ship2StartXLeqShip1End.in[0] <== ships[1][0];
    ship2StartXLeqShip1End.in[1] <== ships[0][0] + length1;

    // ship1.x <= ship2.x + length - 1
    component ship1StartXLeqShip2EndX = LessThan(4);
    ship1StartXLeqShip2EndX.in[0] <== ships[0][0];
    ship1StartXLeqShip2EndX.in[1] <== ships[1][0] + length2;

    // ship1.y + length - 1 <= ship2.y
    component ship1EndYLeqShip2StartY = LessEqThan(4);
    ship1EndYLeqShip2StartY.in[0] <== ships[0][1] + length1 - 1;
    ship1EndYLeqShip2StartY.in[1] <== ships[1][1];

    // ship2.y + length - 1 <= ship1.y
    component ship2EndYLeqShip1StartY = LessEqThan(4);
    ship2EndYLeqShip1StartY.in[0] <== ships[1][1] + length2 - 1;
    ship2EndYLeqShip1StartY.in[1] <== ships[0][1];

    // ship2.y <= ship1.y + length - 1
    component ship2StartYLeqShip1EndY = LessThan(4);
    ship2StartYLeqShip1EndY.in[0] <== ships[1][1];
    ship2StartYLeqShip1EndY.in[1] <== ships[0][1] + length1;

    // ship1.y <= ship2.y + length - 1
    component ship1StartYLeqShip2EndY = LessThan(4);
    ship1StartYLeqShip2EndY.in[0] <== ships[0][1];
    ship1StartYLeqShip2EndY.in[1] <== ships[1][1] + length2;

    /// If ship1.z == 0 and ship2.z == 0
    // ship2.x >= ship1.x
    // ship2.x <= ship1.x + length - 1
    signal ship2StartXInRangeOfShip1X;
    ship2StartXInRangeOfShip1X <== ship2StartXGeqShip1StartX.out * ship2StartXLeqShip1End.out;
    // ship1.y == ship2.y

    // ship1.x >= ship2.x
    // ship1.x <= ship2.x + length - 1
    signal ship1StartXInRangeOfShip2X;
    ship1StartXInRangeOfShip2X <== ship1StartXGeqShip2StartX.out * ship1StartXLeqShip2EndX.out;
    // ship1.y == ship2.y

    /// If ship1.z == 0 and ship2.z == 1
    // ship2.y >= ship1.y
    // ship2.y + length - 1 <= ship1.y
    // ship1.x >= ship2.x
    // ship1.x <= ship2.x + length - 1

    /// If ship1.z == 1 and ship2.z == 0
    // ship1.y >= ship2.y
    // ship1.y + length - 1 <= ship2.y
    // ship2.x >= ship1.x
    // ship2.x <= ship1.x + length - 1

    /// If ship1.z == 1 and ship2.z == 1
    // ship2.y >= ship1.y
    // ship2.y <= ship1.y + length - 1
    // ship1.x == ship2.x

    // ship1.y >= ship2.y
    // ship1.y <= ship2.y + length - 1
    // ship1.x == ship2.x
}