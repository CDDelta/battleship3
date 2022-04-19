snarkjs powersoftau new bn128 15 pot15_0000.ptau -v

snarkjs powersoftau contribute pot15_0000.ptau pot15_0001.ptau --name=mock-contrib -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"