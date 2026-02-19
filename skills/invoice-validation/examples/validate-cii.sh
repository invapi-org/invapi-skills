#!/usr/bin/env bash
# Validate a CII XML invoice against XRechnung 3.0.2 / EN 16931
# Usage: ./validate-cii.sh <invoice.cii.xml>
#
# Requires: INVAPI_API_KEY environment variable

set -euo pipefail

INPUT="${1:?Usage: $0 <invoice.cii.xml>}"

if [ -z "${INVAPI_API_KEY:-}" ]; then
  echo "Error: INVAPI_API_KEY environment variable is not set." >&2
  exit 1
fi

curl -s -X POST https://api.invapi.org/api/v1/cii/validate \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/xml" \
  -d @"$INPUT"
