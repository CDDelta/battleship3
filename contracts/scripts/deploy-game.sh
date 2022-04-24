export $(grep -v '^#' .env | xargs -d '\n')
export $(grep -v '^#' .env-secret | xargs -d '\n')

forge create src/Game.sol:Game \
    --constructor-args 0x4aec0b69f538db5e2c76c4b19815e7363efc81d5 0x5292a5dd83239c8da3d3dd638d808154cff839cb \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --legacy
