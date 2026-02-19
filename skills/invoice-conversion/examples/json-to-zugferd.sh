#!/usr/bin/env bash
# Create a ZUGFeRD PDF from an Invoice JSON and a PDF file
# Usage: ./json-to-zugferd.sh <invoice.json> <invoice.pdf> [output.pdf]
#
# Requires: INVAPI_API_KEY environment variable

set -euo pipefail

INVOICE_JSON="${1:?Usage: $0 <invoice.json> <invoice.pdf> [output.pdf]}"
PDF_FILE="${2:?Usage: $0 <invoice.json> <invoice.pdf> [output.pdf]}"
OUTPUT="${3:-${PDF_FILE%.pdf}.zugferd.pdf}"

if [ -z "${INVAPI_API_KEY:-}" ]; then
  echo "Error: INVAPI_API_KEY environment variable is not set." >&2
  exit 1
fi

curl -s -X POST https://api.invapi.org/api/v1/json/zugferd \
  -H "x-api-key: $INVAPI_API_KEY" \
  -F "file=@$PDF_FILE" \
  -F "invoice=$(cat "$INVOICE_JSON")" \
  -o "$OUTPUT"

echo "ZUGFeRD PDF written to $OUTPUT"
