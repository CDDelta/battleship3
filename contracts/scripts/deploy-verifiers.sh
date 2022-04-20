export $(grep -v '^#' .env | xargs -d '\n')
export $(grep -v '^#' .env-secret | xargs -d '\n')

forge create src/BoardSetupVerifier.sol:BoardSetupVerifier \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --legacy

forge create src/FireShotVerifier.sol:FireShotVerifier \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --legacy
