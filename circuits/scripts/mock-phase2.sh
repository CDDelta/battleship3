snarkjs powersoftau prepare phase2 pot15_0001.ptau pot15_final.ptau -v

snarkjs groth16 setup ./dist/boardsetup.r1cs pot15_final.ptau boardsetup_0000.zkey
snarkjs zkey contribute boardsetup_0000.zkey boardsetup_0001.zkey --name=mock-contrib -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey export verificationkey boardsetup_0001.zkey verification_key.json

snarkjs groth16 setup ./dist/hitcounter.r1cs pot15_final.ptau hitcounter_0000.zkey
snarkjs zkey contribute hitcounter_0000.zkey hitcounter_0001.zkey --name=mock-contrib -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey export verificationkey hitcounter_0001.zkey verification_key.json