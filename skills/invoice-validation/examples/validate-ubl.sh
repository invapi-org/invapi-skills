#!/usr/bin/env bash
# Validate a UBL XML invoice against XRechnung 3.0.2 / EN 16931
# Usage: ./validate-ubl.sh <invoice.ubl.xml>
#
# Requires: INVAPI_API_KEY environment variable

set -euo pipefail

INPUT="${1:?Usage: $0 <invoice.ubl.xml>}"

if [ -z "${INVAPI_API_KEY:-}" ]; then
  echo "Error: INVAPI_API_KEY environment variable is not set." >&2
  exit 1
fi

curl -s -X POST https://api.invapi.org/api/v1/ubl/validate \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/xml" \
  -d @"$INPUT"
