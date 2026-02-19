#!/usr/bin/env python3
# Create a ZUGFeRD PDF from an Invoice JSON and a PDF file
# Usage: python json-to-zugferd.py <invoice.json> <invoice.pdf> [output.pdf]
#
# Requires: INVAPI_API_KEY environment variable, requests library

import os
import sys

import requests

if len(sys.argv) < 3:
    print(
        "Usage: python json-to-zugferd.py <invoice.json> <invoice.pdf> [output.pdf]",
        file=sys.stderr,
    )
    sys.exit(1)

invoice_json_path = sys.argv[1]
pdf_path = sys.argv[2]
output_path = sys.argv[3] if len(sys.argv) > 3 else pdf_path.replace(".pdf", ".zugferd.pdf")

api_key = os.environ.get("INVAPI_API_KEY")
if not api_key:
    print("Error: INVAPI_API_KEY environment variable is not set.", file=sys.stderr)
    sys.exit(1)

with open(invoice_json_path, "r") as f:
    invoice_data = f.read()

with open(pdf_path, "rb") as f:
    resp = requests.post(
        "https://api.invapi.org/api/v1/json/zugferd",
        headers={"x-api-key": api_key},
        files={"file": (os.path.basename(pdf_path), f)},
        data={"invoice": invoice_data},
    )

resp.raise_for_status()

with open(output_path, "wb") as f:
    f.write(resp.content)

print(f"ZUGFeRD PDF written to {output_path}")
