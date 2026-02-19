#!/usr/bin/env python3
# Convert an Invapi Invoice JSON file to UBL XML
# Usage: python json-to-ubl.py <invoice.json> [output.xml]
#
# Requires: INVAPI_API_KEY environment variable, requests library

import os
import sys

import requests

if len(sys.argv) < 2:
    print("Usage: python json-to-ubl.py <invoice.json> [output.xml]", file=sys.stderr)
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2] if len(sys.argv) > 2 else input_path.replace(".json", ".ubl.xml")

api_key = os.environ.get("INVAPI_API_KEY")
if not api_key:
    print("Error: INVAPI_API_KEY environment variable is not set.", file=sys.stderr)
    sys.exit(1)

with open(input_path, "r") as f:
    body = f.read()

resp = requests.post(
    "https://api.invapi.org/api/v1/json/ubl",
    headers={"x-api-key": api_key, "Content-Type": "application/json"},
    data=body,
)
resp.raise_for_status()

with open(output_path, "w") as f:
    f.write(resp.text)

print(f"UBL XML written to {output_path}")
