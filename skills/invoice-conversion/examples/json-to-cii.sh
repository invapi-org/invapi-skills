#!/usr/bin/env bash
# Convert an Invapi Invoice JSON file to CII XML
# Usage: ./json-to-cii.sh <invoice.json> [output.xml]
#
# Requires: INVAPI_API_KEY environment variable

set -euo pipefail

INPUT="${1:?Usage: $0 <invoice.json> [output.xml]}"
OUTPUT="${2:-${INPUT%.json}.cii.xml}"

if [ -z "${INVAPI_API_KEY:-}" ]; then
  echo "Error: INVAPI_API_KEY environment variable is not set." >&2
  exit 1
fi

curl -s -X POST https://api.invapi.org/api/v1/json/cii \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @"$INPUT" \
  -o "$OUTPUT"

echo "CII XML written to $OUTPUT"
