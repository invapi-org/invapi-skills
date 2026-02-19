#!/usr/bin/env bash
# Convert an Invapi Invoice JSON file to UBL XML
# Usage: ./json-to-ubl.sh <invoice.json> [output.xml]
#
# Requires: INVAPI_API_KEY environment variable

set -euo pipefail

INPUT="${1:?Usage: $0 <invoice.json> [output.xml]}"
OUTPUT="${2:-${INPUT%.json}.ubl.xml}"

if [ -z "${INVAPI_API_KEY:-}" ]; then
  echo "Error: INVAPI_API_KEY environment variable is not set." >&2
  exit 1
fi

curl -s -X POST https://api.invapi.org/api/v1/json/ubl \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @"$INPUT" \
  -o "$OUTPUT"

echo "UBL XML written to $OUTPUT"
