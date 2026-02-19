---
name: invoice-validation
description: Validate UBL and CII XML invoices against XRechnung 3.0.2 and EN 16931 rules using the Invapi API.
triggers:
  - validate invoice
  - validate UBL
  - validate CII
  - check XRechnung
  - EN 16931
  - validate XML invoice
---

# Invoice Validation

Validate UBL and CII XML invoices against XRechnung 3.0.2 (EN 16931) rules.

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

### Validate UBL XML

**`POST /api/v1/ubl/validate`**

Validates a UBL 2.1 XML invoice against XRechnung 3.0.2 (EN 16931) rules.

- **Request**: `Content-Type: application/xml` or `text/plain` — UBL XML body
- **Response**: `Content-Type: application/json` — Validation result

```bash
curl -s -X POST https://api.invapi.org/api/v1/ubl/validate \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/xml" \
  -d @invoice.ubl.xml
```

### Validate CII XML

**`POST /api/v1/cii/validate`**

Validates a CII (Cross-Industry Invoice) XML against XRechnung 3.0.2 (EN 16931) rules.

- **Request**: `Content-Type: application/xml` or `text/plain` — CII XML body
- **Response**: `Content-Type: application/json` — Validation result

```bash
curl -s -X POST https://api.invapi.org/api/v1/cii/validate \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/xml" \
  -d @invoice.cii.xml
```

### Response Format

Both endpoints return the same response format:

#### Valid invoice

```json
{
  "valid": true,
  "errors": []
}
```

#### Invalid invoice

```json
{
  "valid": false,
  "errors": [
    { "message": "[BR-01] An Invoice shall have a Specification identifier (BT-24)." },
    { "message": "[BR-06] An Invoice shall contain the Seller name (BT-27)." }
  ]
}
```

## Auto-detecting UBL vs CII

When the user provides an XML file without specifying the format, detect it automatically:

- **UBL**: Root element is `<Invoice>` with namespace `urn:oasis:names:specification:ubl:schema:xsd:Invoice-2`
- **CII**: Root element is `<CrossIndustryInvoice>` with namespace `urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100`

A quick way to check from the command line:

```bash
head -5 invoice.xml | grep -q "CrossIndustryInvoice" && echo "CII" || echo "UBL"
```

## Error Handling

| Status | Meaning                    |
| ------ | -------------------------- |
| 400    | Invalid request body       |
| 401    | Invalid or missing API key |
| 402    | Insufficient credits       |
| 429    | Rate limit exceeded        |
| 500    | Internal server error      |

## Implementation Notes

- Always read the first few lines of the XML file to auto-detect UBL vs CII before calling the correct endpoint.
- Present validation results clearly: if `valid` is `true`, confirm success. If `false`, list each error message.
- The validation rules follow the European standard EN 16931 as implemented by XRechnung 3.0.2.
- To create a valid e-invoice, use the conversion endpoints (`json/ubl` or `json/cii`) which produce compliant XML, then validate the output.
