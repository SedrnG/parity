#!/bin/bash

# change into the js directory (one down from scripts)
pushd `dirname $0`
cd ..

# run build (production) and store the exit code
EXITCODE=0
NODE_ENV=production npm run build || EXITCODE=1

# back to root
popd

# exit with exit code
exit $EXITCODE
