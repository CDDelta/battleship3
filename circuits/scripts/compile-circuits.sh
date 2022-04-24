#!/bin/bash

source ./scripts/common.sh

mkdir -p ./dist

for circuit in "${circuits[@]}"
do
    echo "Compiling $circuit circuit..."
    circom src/"$circuit".circom --r1cs --wasm --sym --c -o dist
done