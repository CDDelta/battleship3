snarkjs powersoftau new bn128 15 ./dist/pot15_0000.ptau -v

snarkjs powersoftau contribute ./dist/pot15_0000.ptau ./dist/pot15_0001.ptau --name=mock-contrib -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"

snarkjs powersoftau prepare phase2 ./dist/pot15_0001.ptau ./pot15_final.ptau -v