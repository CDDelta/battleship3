mkdir -p ./dist

circom src/boardsetup.circom --r1cs --wasm --sym --c -o dist

circom src/fireshot.circom --r1cs --wasm --sym --c -o dist