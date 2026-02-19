#!/usr/bin/env bash
# Extract Invoice JSON from a ZUGFeRD PDF
# Usage: ./zugferd-to-json.sh <invoice.zugferd.pdf>
#
# Requires: INVAPI_API_KEY environment variable

set -euo pipefail

INPUT="${1:?Usage: $0 <invoice.zugferd.pdf>}"

if [ -z "${INVAPI_API_KEY:-}" ]; then
  echo "Error: INVAPI_API_KEY environment variable is not set." >&2
  exit 1
fi

curl -s -X POST https://api.invapi.org/api/v1/zugferd/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/pdf" \
  --data-binary @"$INPUT"
