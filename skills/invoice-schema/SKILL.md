---
name: invoice-schema
description: Reference documentation for the Invapi Invoice JSON schema — all fields, types, required fields, enums, and nested objects.
triggers:
  - invoice schema
  - invoice format
  - invoice fields
  - what fields does an invoice have
  - invoice JSON structure
---

# Invoice JSON Schema

Reference for the Invapi Invoice JSON schema used across all API endpoints.

## Quick Reference

See the full schema documentation at `${CLAUDE_PLUGIN_ROOT}/skills/invoice-schema/references/schema.md`.

## Required Top-Level Fields

| Field                    | Type   | Description                        |
| ------------------------ | ------ | ---------------------------------- |
| `invoice_number`         | string | Unique invoice identification      |
| `invoice_date`           | string | Issue date (YYYY-MM-DD)            |
| `invoice_currency_code`  | string | ISO 4217 currency code             |
| `invoice_type`           | string | `"incoming"` or `"outgoing"`       |
| `seller`                 | object | Seller party details               |
| `buyer`                  | object | Buyer party details                |
| `payment_information`    | object | Payment terms and method           |
| `totals`                 | object | Invoice totals and amounts         |
| `items`                  | array  | Line items (min 1)                 |
| `invoice_description`    | string | Short description of the invoice   |

## Optional Top-Level Fields

| Field                  | Type   | Description                        |
| ---------------------- | ------ | ---------------------------------- |
| `invoice_note`         | string | Free-text note                     |
| `additional_data`      | object | Extra data (reverse charge, Leitweg-ID, order/project refs) |
| `delivery_information` | object | Delivery address and details       |
| `category`             | string | Invoice category (from extraction) |
| `id`                   | string | Internal ID                        |

## Minimal Valid Invoice Example

```json
{
  "invoice_number": "INV-2025-001",
  "invoice_date": "2025-01-15",
  "invoice_currency_code": "EUR",
  "invoice_type": "outgoing",
  "invoice_description": "Consulting services January 2025",
  "seller": {
    "name": "Seller GmbH",
    "postal_address": {
      "address_line_1": "Hauptstr. 1",
      "city": "Berlin",
      "post_code": "10115",
      "country_code": "DE"
    },
    "vat_identifier": "DE123456789",
    "contact": {
      "email_address": "info@seller.de"
    }
  },
  "buyer": {
    "name": "Buyer AG",
    "postal_address": {
      "address_line_1": "Bahnhofstr. 10",
      "city": "Munich",
      "post_code": "80331",
      "country_code": "DE"
    },
    "contact": {
      "email_address": "ap@buyer.de"
    }
  },
  "payment_information": {
    "payment_type": "credit_transfer",
    "payment_due_date": "2025-02-15"
  },
  "totals": {
    "total_amount_without_vat": 1000.00,
    "total_amount_with_vat": 1190.00,
    "total_vat_amount": 190.00,
    "amount_due_for_payment": 1190.00,
    "paid_amount": 0
  },
  "items": [
    {
      "item_identifier": "1",
      "item_quantity": 10,
      "item_quantity_unit_of_measure_code": "HUR",
      "item_total_amount_with_vat": 1190.00,
      "item_total_amount_without_vat": 1000.00,
      "price_details": {
        "item_price_without_vat": 100.00,
        "item_price_with_vat": 119.00,
        "item_vat_percentage": 19,
        "vat_category_code": "S"
      },
      "item_information": "Consulting services"
    }
  ]
}
```

## Implementation Notes

- When building invoice JSON for conversion, ensure all required fields are present — the API returns 400 with field-level errors for missing required fields.
- The `invoice_type` field describes the direction from the user's perspective: `"incoming"` = received from a supplier, `"outgoing"` = sent to a customer.
- Currency codes follow ISO 4217. Common codes: EUR, USD, GBP, CHF.
- Dates must be in `YYYY-MM-DD` format.
- VAT category codes follow EN 16931: `S` (standard), `Z` (zero-rated), `E` (exempt), `AE` (reverse charge), `K` (intra-community), `G` (export), `O` (outside scope), `L` (Canary Islands), `M` (Ceuta/Melilla).
