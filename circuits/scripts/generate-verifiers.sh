snarkjs zkey export solidityverifier ./dist/boardsetup_0001.zkey ../contracts/src/BoardSetupVerifier.sol
sed -i -e 's/Verifier/BoardSetupVerifier/g' ../contracts/src/BoardSetupVerifier.sol

snarkjs zkey export solidityverifier ./dist/fireshot_0001.zkey ../contracts/src/FireShotVerifier.sol
sed -i -e 's/Verifier/FireShotVerifier/g' ../contracts/src/FireShotVerifier.sol