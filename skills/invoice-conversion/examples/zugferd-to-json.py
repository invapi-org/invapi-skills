#!/usr/bin/env python3
# Extract Invoice JSON from a ZUGFeRD PDF
# Usage: python zugferd-to-json.py <invoice.zugferd.pdf>
#
# Requires: INVAPI_API_KEY environment variable, requests library

import os
import sys

import requests

if len(sys.argv) < 2:
    print("Usage: python zugferd-to-json.py <invoice.zugferd.pdf>", file=sys.stderr)
    sys.exit(1)

input_path = sys.argv[1]

api_key = os.environ.get("INVAPI_API_KEY")
if not api_key:
    print("Error: INVAPI_API_KEY environment variable is not set.", file=sys.stderr)
    sys.exit(1)

with open(input_path, "rb") as f:
    body = f.read()

resp = requests.post(
    "https://api.invapi.org/api/v1/zugferd/json",
    headers={"x-api-key": api_key, "Content-Type": "application/pdf"},
    data=body,
)
resp.raise_for_status()
print(resp.text)
