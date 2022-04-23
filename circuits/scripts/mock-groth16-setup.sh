snarkjs groth16 setup ./dist/boardsetup.r1cs ./pot15_final.ptau ./dist/boardsetup_0000.zkey
snarkjs zkey contribute ./dist/boardsetup_0000.zkey ./boardsetup_final.zkey --name=mock-contrib -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey export verificationkey ./boardsetup_final.zkey ./boardsetup_verification_key.json

snarkjs groth16 setup ./dist/fireshot.r1cs ./pot15_final.ptau ./dist/fireshot_0000.zkey
snarkjs zkey contribute ./dist/fireshot_0000.zkey ./fireshot_final.zkey --name=mock-contrib -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey export verificationkey ./fireshot_final.zkey ./fireshot_verification_key.json