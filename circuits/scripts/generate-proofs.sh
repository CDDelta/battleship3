#!/bin/bash

source ./scripts/common.sh

for circuit in "${circuits[@]}"
do
    echo "Generating $circuit proof..."
    snarkjs groth16 prove ./"$circuit"_final.zkey "$circuit".wtns "$circuit"-proof.json "$circuit"-public.json
done
