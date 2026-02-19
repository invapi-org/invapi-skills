#!/usr/bin/env python3
# Validate a CII XML invoice against XRechnung 3.0.2 / EN 16931
# Usage: python validate-cii.py <invoice.cii.xml>
#
# Requires: INVAPI_API_KEY environment variable, requests library

import os
import sys

import requests

if len(sys.argv) < 2:
    print("Usage: python validate-cii.py <invoice.cii.xml>", file=sys.stderr)
    sys.exit(1)

input_path = sys.argv[1]

api_key = os.environ.get("INVAPI_API_KEY")
if not api_key:
    print("Error: INVAPI_API_KEY environment variable is not set.", file=sys.stderr)
    sys.exit(1)

with open(input_path, "r") as f:
    body = f.read()

resp = requests.post(
    "https://api.invapi.org/api/v1/cii/validate",
    headers={"x-api-key": api_key, "Content-Type": "application/xml"},
    data=body,
)
resp.raise_for_status()
print(resp.text)
