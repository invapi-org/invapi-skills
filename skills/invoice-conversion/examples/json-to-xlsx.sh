#!/usr/bin/env bash
# Convert Invapi Invoice JSON file(s) to an Excel spreadsheet
# Usage: ./json-to-xlsx.sh <invoice.json> [output.xlsx]
#
# Requires: INVAPI_API_KEY environment variable

set -euo pipefail

INPUT="${1:?Usage: $0 <invoice.json> [output.xlsx]}"
OUTPUT="${2:-invoices.xlsx}"

if [ -z "${INVAPI_API_KEY:-}" ]; then
  echo "Error: INVAPI_API_KEY environment variable is not set." >&2
  exit 1
fi

# Wrap the invoice in the required {"invoices": [...]} format
curl -s -X POST https://api.invapi.org/api/v1/json/xlsx \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"invoices": ['"$(cat "$INPUT")"']}' \
  -o "$OUTPUT"

echo "Excel file written to $OUTPUT"
