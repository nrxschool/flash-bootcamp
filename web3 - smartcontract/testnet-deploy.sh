export ETHSCAN=
export ALCHEMY=

forge create src/TaskManager.sol:TaskManager \
    --account sepolia \
    --broadcast \
    --rpc-url https://eth-sepolia.g.alchemy.com/v2/$ALCHEMY \
    --verify \
    --verifier-api-key $ETHSCAN
