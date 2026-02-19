---
name: invoice-conversion
description: Convert invoices between formats using the Invapi API. Supports JSON, UBL XML, CII XML, Excel (XLSX), and ZUGFeRD PDF.
triggers:
  - convert invoice
  - JSON to UBL
  - JSON to CII
  - UBL to JSON
  - CII to JSON
  - JSON to Excel
  - JSON to XLSX
  - create ZUGFeRD
  - JSON to ZUGFeRD
  - ZUGFeRD to JSON
  - export to Excel
  - batch convert
---

# Invoice Conversion

Convert invoices between JSON, UBL XML, CII XML, Excel, and ZUGFeRD PDF formats.

## Prerequisites

The `INVAPI_API_KEY` environment variable must be set:

```bash
export INVAPI_API_KEY="your-api-key"
```

Get an API key at https://invapi.org

## Base URL

```
https://api.invapi.org
```

## Endpoints

### JSON → UBL XML

**`POST /api/v1/json/ubl`**

Converts an Invapi Invoice JSON object to UBL 2.1 XML.

- **Request**: `Content-Type: application/json` — Invoice JSON body
- **Response**: `Content-Type: application/xml` — UBL XML

```bash
curl -s -X POST https://api.invapi.org/api/v1/json/ubl \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @invoice.json \
  -o invoice.ubl.xml
```

### JSON → CII XML

**`POST /api/v1/json/cii`**

Converts an Invapi Invoice JSON object to CII (Cross-Industry Invoice) XML.

- **Request**: `Content-Type: application/json` — Invoice JSON body
- **Response**: `Content-Type: application/xml` — CII XML

```bash
curl -s -X POST https://api.invapi.org/api/v1/json/cii \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @invoice.json \
  -o invoice.cii.xml
```

### UBL XML → JSON

**`POST /api/v1/ubl/json`**

Converts a UBL XML file to Invapi Invoice JSON.

- **Request**: `Content-Type: application/xml` or `text/plain` — UBL XML body
- **Response**: `Content-Type: application/json` — Invoice JSON

```bash
curl -s -X POST https://api.invapi.org/api/v1/ubl/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/xml" \
  -d @invoice.ubl.xml
```

### CII XML → JSON

**`POST /api/v1/cii/json`**

Converts a CII XML file to Invapi Invoice JSON.

- **Request**: `Content-Type: application/xml` or `text/plain` — CII XML body
- **Response**: `Content-Type: application/json` — Invoice JSON

```bash
curl -s -X POST https://api.invapi.org/api/v1/cii/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/xml" \
  -d @invoice.cii.xml
```

### JSON → Excel (XLSX)

**`POST /api/v1/json/xlsx`**

Converts one or more Invoice JSON objects to an Excel spreadsheet.

- **Request**: `Content-Type: application/json` — `{ "invoices": [ ... ] }` array
- **Response**: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` — XLSX binary

```bash
curl -s -X POST https://api.invapi.org/api/v1/json/xlsx \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"invoices": ['"$(cat invoice.json)"']}' \
  -o invoices.xlsx
```

**Note**: The request body wraps invoices in an `{"invoices": [...]}` array, allowing multiple invoices in a single spreadsheet.

### JSON + PDF → ZUGFeRD PDF

**`POST /api/v1/json/zugferd`**

Creates a ZUGFeRD/Factur-X PDF by embedding CII XML invoice data into a PDF file.

#### Option 1: JSON body with base64-encoded PDF

```bash
curl -s -X POST https://api.invapi.org/api/v1/json/zugferd \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "file": {
      "content": "'$(base64 -w 0 invoice.pdf)'",
      "contentType": "application/pdf",
      "fileName": "invoice.pdf"
    },
    "invoice": '"$(cat invoice.json)"'
  }' \
  -o invoice.zugferd.pdf
```

#### Option 2: Multipart form-data

```bash
curl -s -X POST https://api.invapi.org/api/v1/json/zugferd \
  -H "x-api-key: $INVAPI_API_KEY" \
  -F "file=@invoice.pdf" \
  -F "invoice=$(cat invoice.json)" \
  -o invoice.zugferd.pdf
```

- **Response**: `Content-Type: application/pdf` — ZUGFeRD PDF/A-3 with embedded XML

### ZUGFeRD PDF → JSON

**`POST /api/v1/zugferd/json`**

Extracts the embedded XML from a ZUGFeRD/Factur-X PDF and converts it to Invoice JSON.

- **Request**: `Content-Type: application/pdf` — ZUGFeRD PDF binary
- **Response**: `Content-Type: application/json` — Invoice JSON

```bash
curl -s -X POST https://api.invapi.org/api/v1/zugferd/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/pdf" \
  --data-binary @invoice.zugferd.pdf
```

### Batch Convert

**`POST /api/v1/batch/convert`**

Process multiple conversion operations in a single request (up to 100 operations).

- **Request**: `Content-Type: application/json`
- **Supported operations**: `json_to_ubl`, `json_to_cii`, `ubl_to_json`, `cii_to_json`, `zugferd_to_json`

```bash
curl -s -X POST https://api.invapi.org/api/v1/batch/convert \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "operations": [
      {
        "id": "op-1",
        "operation": "json_to_ubl",
        "input": '"$(cat invoice1.json)"'
      },
      {
        "id": "op-2",
        "operation": "json_to_cii",
        "input": '"$(cat invoice2.json)"'
      }
    ]
  }'
```

#### Batch Response

```json
{
  "results": [
    { "id": "op-1", "success": true, "output": "<?xml ..." },
    { "id": "op-2", "success": true, "output": "<?xml ..." }
  ],
  "summary": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "processing_time_ms": 150
  }
}
```

Each operation is processed independently — failures in one do not affect others.

## Error Handling

| Status | Meaning                                |
| ------ | -------------------------------------- |
| 400    | Invalid invoice data or validation failed |
| 401    | Invalid or missing API key             |
| 402    | Insufficient credits                   |
| 429    | Rate limit exceeded                    |
| 500    | Internal server error                  |

A 400 error returns field-level validation errors:

```json
{
  "statusCode": 400,
  "statusMessage": "Bad Request",
  "data": {
    "errors": [
      { "path": "seller.postal_address.city", "message": "Required" }
    ]
  }
}
```

## Implementation Notes

- For JSON → XML conversions, the input must be a valid Invapi Invoice JSON object. See the `invoice-schema` skill for the full schema.
- For XML → JSON conversions, send the raw XML as the request body with `Content-Type: application/xml`.
- For ZUGFeRD → JSON, send the raw PDF bytes with `Content-Type: application/pdf` and `--data-binary`.
- Binary responses (XLSX, PDF) must be saved with `-o <filename>`.
- The batch endpoint is useful when converting multiple invoices at once — it reduces HTTP overhead and costs one credit per operation.
