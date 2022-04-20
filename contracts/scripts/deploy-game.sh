export $(grep -v '^#' .env | xargs -d '\n')
export $(grep -v '^#' .env-secret | xargs -d '\n')

forge create src/Game.sol:Game \
    --constructor-args 0xf2a54f0be108998aecf33223d81c9fcfb121b3b2 0xbe7a9603e1604fb619171750677ca206d23e1870 \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --legacy
