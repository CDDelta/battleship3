#!/bin/bash

source ./scripts/common.sh

for circuit in "${circuits[@]}"
do
    echo "Setting up $circuit circuit..."
    snarkjs groth16 setup ./dist/"$circuit".r1cs ./powersOfTau28_hez_final_15.ptau ./dist/"$circuit"_0000.zkey
    snarkjs zkey contribute ./dist/"$circuit"_0000.zkey ./"$circuit"_final.zkey --name=mock-contrib -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
    snarkjs zkey verify ./dist/"$circuit".r1cs ./powersOfTau28_hez_final_15.ptau ./"$circuit"_final.zkey
    snarkjs zkey export verificationkey ./"$circuit"_final.zkey ./"$circuit"_verification_key.json
done
