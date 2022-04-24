#!/bin/bash

source ./scripts/common.sh

for i in "${!circuits[@]}"
do
    echo "Generating ${circuit_verifiers[i]}..."
    snarkjs zkey export solidityverifier ./"${circuits[i]}"_final.zkey ../contracts/src/"${circuit_verifiers[i]}".sol
    sed -i -e "s/Verifier/"${circuit_verifiers[i]}"/g" ../contracts/src/"${circuit_verifiers[i]}".sol
done
