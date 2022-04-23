snarkjs zkey export verificationkey ./boardsetup_final.zkey ./boardsetup_verification_key.json
snarkjs zkey export solidityverifier ./boardsetup_final.zkey ../contracts/src/BoardSetupVerifier.sol
sed -i -e 's/Verifier/BoardSetupVerifier/g' ../contracts/src/BoardSetupVerifier.sol

snarkjs zkey export verificationkey ./fireshot_final.zkey ./fireshot_verification_key.json
snarkjs zkey export solidityverifier ./fireshot_final.zkey ../contracts/src/FireShotVerifier.sol
sed -i -e 's/Verifier/FireShotVerifier/g' ../contracts/src/FireShotVerifier.sol