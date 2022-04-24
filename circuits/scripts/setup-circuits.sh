snarkjs plonk setup ./dist/boardsetup.r1cs ./powersOfTau28_hez_final_15.ptau ./boardsetup_final.zkey
snarkjs zkey export verificationkey ./boardsetup_final.zkey ./boardsetup_verification_key.json

snarkjs plonk setup ./dist/fireshot.r1cs ./powersOfTau28_hez_final_15.ptau ./fireshot_final.zkey
snarkjs zkey export verificationkey ./fireshot_final.zkey ./fireshot_verification_key.json
