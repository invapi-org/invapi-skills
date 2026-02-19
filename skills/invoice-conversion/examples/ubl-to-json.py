#!/usr/bin/env python3
# Convert a UBL XML file to Invapi Invoice JSON
# Usage: python ubl-to-json.py <invoice.ubl.xml>
#
# Requires: INVAPI_API_KEY environment variable, requests library

import os
import sys

import requests

if len(sys.argv) < 2:
    print("Usage: python ubl-to-json.py <invoice.ubl.xml>", file=sys.stderr)
    sys.exit(1)

input_path = sys.argv[1]

api_key = os.environ.get("INVAPI_API_KEY")
if not api_key:
    print("Error: INVAPI_API_KEY environment variable is not set.", file=sys.stderr)
    sys.exit(1)

with open(input_path, "r") as f:
    body = f.read()

resp = requests.post(
    "https://api.invapi.org/api/v1/ubl/json",
    headers={"x-api-key": api_key, "Content-Type": "application/xml"},
    data=body,
)
resp.raise_for_status()
print(resp.text)
