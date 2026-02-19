#!/usr/bin/env bash
# Extract invoice data from a PDF file using the Invapi API
# Usage: ./extract-invoice.sh <path-to-pdf>
#
# Requires: INVAPI_API_KEY environment variable

set -euo pipefail

FILE="${1:?Usage: $0 <path-to-pdf-or-image>}"

if [ -z "${INVAPI_API_KEY:-}" ]; then
  echo "Error: INVAPI_API_KEY environment variable is not set." >&2
  echo "Get an API key at https://invapi.org" >&2
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "Error: File not found: $FILE" >&2
  exit 1
fi

curl -s -X POST https://api.invapi.org/api/v1/file/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -F "file=@$FILE"
