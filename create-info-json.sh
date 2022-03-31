#!/bin/bash

touch public/info.json

REVISION_HASH=$(git rev-parse HEAD)

BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

JSON_FMT='{"revision":"%s", "branch": "%s"}'

printf "$JSON_FMT" "$REVISION_HASH" "$BRANCH_NAME" > public/info.json
