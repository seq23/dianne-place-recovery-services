#!/usr/bin/env bash
set -euo pipefail

if [[ "${PUBLISH:?expected the search engine publishing mode}" == true ]]; then
  git pull --ff-only origin main
  printf 'OUTPUT 1 publishing baseline verified\n'
else
  printf 'NAMED STOP [SEARCH_PROOF_BRANCH] Keep the selected branch for validation\n'
fi
