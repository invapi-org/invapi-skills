---
name: invoice-extraction
description: Extract structured invoice data from PDF files and images using the Invapi API. Supports OCR, QR code extraction, party matching, and custom classification.
triggers:
  - extract invoice from PDF
  - extract invoice from image
  - scan invoice
  - OCR invoice
  - extract QR code
  - read invoice
---

# Invoice Extraction

Extract structured JSON invoice data from PDF files and images using the Invapi API.

## Prerequisites

The `INVAPI_API_KEY` environment variable must be set. If it is not set, instruct the user to set it:

```bash
export INVAPI_API_KEY="your-api-key"
```

Get an API key at https://invapi.org

## Base URL

```
https://api.invapi.org
```

## Endpoints

### Extract Invoice from PDF/Image → JSON

**`POST /api/v1/file/json`**

Processes a PDF or image file and returns structured invoice JSON.

#### Option 1: JSON body with base64-encoded file

```bash
curl -X POST https://api.invapi.org/api/v1/file/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "file": {
      "content": "'$(base64 -w 0 invoice.pdf)'",
      "contentType": "application/pdf",
      "fileName": "invoice.pdf"
    }
  }'
```

#### Option 2: Multipart form-data (recommended for Claude Code)

```bash
curl -X POST https://api.invapi.org/api/v1/file/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -F "file=@invoice.pdf"
```

#### Optional Parameters

| Parameter      | Type     | Description                                                      |
| -------------- | -------- | ---------------------------------------------------------------- |
| `qr`           | boolean  | Extract QR code data from the document. Default: `false`         |
| `parties`      | array    | Known parties (seller/buyer) to improve extraction accuracy      |
| `categories`   | array    | Categories for automatic invoice classification                  |
| `instructions` | string   | Custom instructions for the extraction LLM                       |

#### Parties format (JSON body)

```json
{
  "file": { "content": "...", "contentType": "application/pdf", "fileName": "invoice.pdf" },
  "parties": [
    {
      "name": "Acme Corp",
      "postal_address": {
        "address_line_1": "123 Main St",
        "city": "Berlin",
        "post_code": "10115",
        "country_code": "DE"
      },
      "vat_identifier": "DE123456789",
      "contact": {
        "email_address": "billing@acme.com"
      }
    }
  ]
}
```

#### Parties format (multipart — JSON-encoded string)

```bash
curl -X POST https://api.invapi.org/api/v1/file/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -F "file=@invoice.pdf" \
  -F 'parties=[{"name":"Acme Corp","postal_address":{"address_line_1":"123 Main St","city":"Berlin","post_code":"10115","country_code":"DE"},"contact":{"email_address":"billing@acme.com"}}]'
```

#### Categories format

```json
{
  "categories": [
    { "id": "office", "name": "Office Supplies", "description": "Pens, paper, etc." },
    { "id": "software", "name": "Software", "description": "Software licenses and SaaS" }
  ]
}
```

#### Response (200 OK)

```json
{
  "invoice": {
    "invoice_number": "INV-2025-001",
    "invoice_date": "2025-01-15",
    "invoice_currency_code": "EUR",
    "invoice_type": "incoming",
    "seller": { ... },
    "buyer": { ... },
    "payment_information": { ... },
    "totals": { ... },
    "items": [ ... ],
    "invoice_description": "Monthly consulting services",
    "category": "software"
  },
  "qr": null
}
```

The `invoice` object follows the Invapi Invoice JSON schema. See the `invoice-schema` skill for the full schema reference.

### Extract QR Code from Image

**`POST /api/v1/file/qr`**

Scans an image for QR codes and returns parsed data.

```bash
curl -X POST https://api.invapi.org/api/v1/file/qr \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "file": {
      "content": "'$(base64 -w 0 qr-image.png)'",
      "contentType": "image/png",
      "fileName": "qr-image.png"
    }
  }'
```

## Error Handling

| Status | Meaning                              |
| ------ | ------------------------------------ |
| 400    | Invalid file data or processing failed |
| 401    | Invalid or missing API key           |
| 402    | Insufficient credits                 |
| 429    | Rate limit exceeded                  |
| 500    | Internal server error                |

## Implementation Notes

- When the user provides a file path, use multipart/form-data with `curl -F "file=@<path>"` — this is the simplest approach from the command line.
- When the user wants to include `parties`, `categories`, or `instructions` with multipart, pass them as additional `-F` fields with JSON-encoded string values.
- The `qr` parameter in multipart should be passed as the string `"true"` or `"false"`.
- Supported file types: PDF, PNG, JPG/JPEG, TIFF, BMP, WebP.
- Always save the JSON response to a file so the user can inspect or further process it.
- The response `invoice` object can be directly used with the conversion endpoints (e.g., to generate UBL or CII XML).
