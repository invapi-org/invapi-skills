#!/usr/bin/env python3
# Convert Invapi Invoice JSON file(s) to an Excel spreadsheet
# Usage: python json-to-xlsx.py <invoice.json> [output.xlsx]
#
# Requires: INVAPI_API_KEY environment variable, requests library

import json
import os
import sys

import requests

if len(sys.argv) < 2:
    print("Usage: python json-to-xlsx.py <invoice.json> [output.xlsx]", file=sys.stderr)
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2] if len(sys.argv) > 2 else "invoices.xlsx"

api_key = os.environ.get("INVAPI_API_KEY")
if not api_key:
    print("Error: INVAPI_API_KEY environment variable is not set.", file=sys.stderr)
    sys.exit(1)

# Wrap the invoice in the required {"invoices": [...]} format
with open(input_path, "r") as f:
    invoice = json.load(f)

resp = requests.post(
    "https://api.invapi.org/api/v1/json/xlsx",
    headers={"x-api-key": api_key, "Content-Type": "application/json"},
    json={"invoices": [invoice]},
)
resp.raise_for_status()

with open(output_path, "wb") as f:
    f.write(resp.content)

print(f"Excel file written to {output_path}")
