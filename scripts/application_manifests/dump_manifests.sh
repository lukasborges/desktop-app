#!/usr/bin/env bash

set -euo pipefail

SCRIPT_FOLDER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPOSITORY_ROOT="$(cd "$SCRIPT_FOLDER/../.." && pwd)"
MANIFEST_FOLDER="$REPOSITORY_ROOT/packages/app/manifests/definitions"
SERVER="${APPLICATION_CATALOG_SERVER:-http://localhost:4001}"

# The checked-in manifests are the catalog's single source of truth. Refresh only
# those applications instead of maintaining a second, easily stale list of IDs.
for manifest in "$MANIFEST_FOLDER"/*.json; do
  identifier="$(basename "$manifest" .json)"
  downloaded_manifest="$(mktemp)"
  merged_manifest="$(mktemp)"
  trap 'rm -f "$downloaded_manifest" "$merged_manifest"' EXIT

  curl --fail --silent --show-error \
    "$SERVER/application-recipe/$identifier/bxAppManifest.json" \
    --output "$downloaded_manifest"
  jq -s '.[0] * .[1]' "$downloaded_manifest" "$manifest" > "$merged_manifest"
  mv "$merged_manifest" "$manifest"
  rm -f "$downloaded_manifest"
  trap - EXIT
done
