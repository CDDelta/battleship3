export $(grep -v '^#' .env | xargs -d '\n')
export $(grep -v '^#' .env-secret | xargs -d '\n')

forge create src/Game.sol:Game \
    --constructor-args 0x9b8c2f30beef6e0331afa69ec5a7051fce49f087 0xebf9adf8005a3d590fd655c37e91550e3892b9ea \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --legacy
