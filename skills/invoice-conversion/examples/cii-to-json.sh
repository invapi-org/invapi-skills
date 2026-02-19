#!/usr/bin/env bash
# Convert a CII XML file to Invapi Invoice JSON
# Usage: ./cii-to-json.sh <invoice.cii.xml>
#
# Requires: INVAPI_API_KEY environment variable

set -euo pipefail

INPUT="${1:?Usage: $0 <invoice.cii.xml>}"

if [ -z "${INVAPI_API_KEY:-}" ]; then
  echo "Error: INVAPI_API_KEY environment variable is not set." >&2
  exit 1
fi

curl -s -X POST https://api.invapi.org/api/v1/cii/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/xml" \
  -d @"$INPUT"
