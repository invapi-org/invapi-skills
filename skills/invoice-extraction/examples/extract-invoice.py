#!/usr/bin/env python3
# Extract invoice data from a PDF file using the Invapi API
# Usage: python extract-invoice.py <path-to-pdf-or-image>
#
# Requires: INVAPI_API_KEY environment variable, requests library

import os
import sys

import requests

if len(sys.argv) < 2:
    print("Usage: python extract-invoice.py <path-to-pdf-or-image>", file=sys.stderr)
    sys.exit(1)

file_path = sys.argv[1]

api_key = os.environ.get("INVAPI_API_KEY")
if not api_key:
    print("Error: INVAPI_API_KEY environment variable is not set.", file=sys.stderr)
    print("Get an API key at https://invapi.org", file=sys.stderr)
    sys.exit(1)

if not os.path.isfile(file_path):
    print(f"Error: File not found: {file_path}", file=sys.stderr)
    sys.exit(1)

with open(file_path, "rb") as f:
    resp = requests.post(
        "https://api.invapi.org/api/v1/file/json",
        headers={"x-api-key": api_key},
        files={"file": (os.path.basename(file_path), f)},
    )

resp.raise_for_status()
print(resp.text)
