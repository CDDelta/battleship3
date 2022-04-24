#!/bin/bash

source ./scripts/common.sh

for circuit in "${circuits[@]}"
do
    echo "Generating $circuit witness..."
    node dist/"$circuit"_js/generate_witness.js dist/"$circuit"_js/"$circuit".wasm "$circuit"-input.json "$circuit".wtns
done
