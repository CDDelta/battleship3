#!/bin/bash

source ./scripts/common.sh

for circuit in "${circuits[@]}"
do
    echo "Verifying $circuit proof..."
    snarkjs groth16 verify ./"$circuit"_verification_key.json "$circuit"-public.json "$circuit"-proof.json
done
