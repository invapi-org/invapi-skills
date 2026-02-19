# Invapi Invoice JSON Schema Reference

Complete field-level documentation for the Invapi Invoice JSON schema.

## Top-Level Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `invoice_number` | string | Yes | A unique identification of the Invoice |
| `invoice_date` | string | Yes | Issue date. Format: `YYYY-MM-DD` |
| `invoice_currency_code` | string | Yes | ISO 4217 currency code (e.g., `EUR`, `USD`, `GBP`) |
| `invoice_type` | string | Yes | `"incoming"` (received from vendor) or `"outgoing"` (sent to customer) |
| `invoice_note` | string | No | Free-text note |
| `invoice_description` | string | Yes | Short description of the invoice |
| `category` | string | No | Category assigned during extraction |
| `id` | string | No | Internal identifier |
| `additional_data` | object | No | See [Additional Data](#additional-data) |
| `seller` | object | Yes | See [Party (Seller/Buyer)](#party-sellerbuyer) |
| `buyer` | object | Yes | See [Party (Seller/Buyer)](#party-sellerbuyer) |
| `delivery_information` | object | No | See [Delivery Information](#delivery-information) |
| `payment_information` | object | Yes | See [Payment Information](#payment-information) |
| `totals` | object | Yes | See [Totals](#totals) |
| `items` | array | Yes | See [Line Items](#line-items). Minimum 1 item. |

## Additional Data

`additional_data` object fields:

| Field | Type | Description |
|---|---|---|
| `reverse_charge` | boolean | `true` if VAT reverse charge applies |
| `leitweg_id` | string | Leitweg-ID for German government payments. Pattern: `^\d{12}(-[A-Za-z0-9]{1,30})?$` |
| `customer_id` | string | Customer identifier |
| `order_id` | string | Purchase order reference |
| `delivery_id` | string | Delivery note reference |
| `project` | string | Project reference |
| `preceeding_invoice_number` | string | Reference to a preceding invoice (for credit notes) |
| `invoicing_period` | object | Period of service: `{ "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" }` (both required) |

## Party (Seller/Buyer)

Both `seller` and `buyer` share the same structure.

**Required fields**: `name`, `postal_address`, `contact`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Full formal name of the party |
| `postal_address` | object | Yes | See [Postal Address](#postal-address) |
| `vat_identifier` | string | No | VAT identification number (e.g., `DE123456789`) |
| `contact` | object | Yes | See [Contact](#contact) |

### Postal Address

**Required fields**: `address_line_1`, `city`, `post_code`, `country_code`

| Field | Type | Required | Description |
|---|---|---|---|
| `address_line_1` | string | Yes | Street address |
| `address_line_2` | string | No | Additional address line |
| `address_line_3` | string | No | Additional address line |
| `city` | string | Yes | City |
| `post_code` | string | Yes | Postal/ZIP code |
| `country_subdivision` | string | No | State/province |
| `country_code` | string | Yes | ISO 3166-1 alpha-2 country code (2 characters, e.g., `DE`, `US`, `FR`) |

### Contact

All fields optional (but the `contact` object itself is required).

| Field | Type | Description |
|---|---|---|
| `telephone_number` | string | Phone number |
| `email_address` | string | Email address |

## Delivery Information

All fields optional.

| Field | Type | Description |
|---|---|---|
| `deliver_to` | string | Delivery recipient name |
| `deliver_to_address` | object | Same structure as [Postal Address](#postal-address) |
| `delivery_date` | string | Delivery date |
| `delivery_method` | string | Delivery method |
| `delivery_instructions` | string | Special delivery instructions |

## Payment Information

All fields optional (but the `payment_information` object itself is required).

| Field | Type | Description |
|---|---|---|
| `payment_type` | string | One of: `"credit_card"`, `"credit_transfer"`, `"cash"`, `"online_payment_service"` |
| `payment_reference` | string | Payment reference number |
| `payment_instructions` | string | Payment instructions text |
| `payment_account_number` | string | Bank account / IBAN |
| `credit_card_number` | string | Credit card number |
| `credit_card_type` | string | Credit card type |
| `payment_due_date` | string | Due date. Format: `YYYY-MM-DD` |
| `payment_payed_date` | string | Date payment was made. Format: `YYYY-MM-DD` |
| `payment_terms` | string | Payment terms description |

## Totals

**Required fields**: `total_amount_without_vat`, `total_amount_with_vat`, `total_vat_amount`, `amount_due_for_payment`, `paid_amount`

| Field | Type | Required | Description |
|---|---|---|---|
| `total_amount_without_vat` | number | Yes | Sum of all line items net |
| `total_amount_with_vat` | number | Yes | Sum of all line items gross |
| `total_vat_amount` | number | Yes | Total VAT amount |
| `amount_due_for_payment` | number | Yes | Amount due (gross minus paid) |
| `paid_amount` | number | Yes | Amount already paid |
| `sum_of_allowances` | number | No | Total allowances/discounts |
| `sum_of_charges` | number | No | Total surcharges |
| `invoice_total_without_vat` | number | No | Invoice total net (after allowances/charges) |
| `rounding_amount` | number | No | Rounding adjustment |

## Line Items

Each item in the `items` array has the following fields:

**Required fields**: `item_identifier`, `item_quantity`, `item_quantity_unit_of_measure_code`, `item_total_amount_with_vat`, `price_details`

| Field | Type | Required | Description |
|---|---|---|---|
| `item_identifier` | string | Yes | Line item identifier |
| `item_quantity` | number | Yes | Quantity |
| `item_quantity_unit_of_measure_code` | string | Yes | UN/ECE Recommendation 20 unit code (e.g., `HUR` = hours, `C62` = units, `KGM` = kg) |
| `item_total_amount_with_vat` | number | Yes | Line total gross |
| `item_total_amount_without_vat` | number | No | Line total net |
| `price_details` | object | Yes | See [Price Details](#price-details) |
| `item_information` | string | No | Item description |

### Price Details

**Required fields**: `item_price_without_vat`, `item_price_with_vat`, `item_vat_percentage`, `vat_category_code`

| Field | Type | Required | Description |
|---|---|---|---|
| `item_price_without_vat` | number | Yes | Unit price net |
| `item_price_with_vat` | number | Yes | Unit price gross |
| `item_price_discount` | number | No | Discount per unit |
| `item_vat_percentage` | number | Yes | VAT rate (e.g., `19` for 19%) |
| `vat_category_code` | string | Yes | VAT category code (see below) |

### VAT Category Codes

| Code | Description |
|---|---|
| `S` | Standard rate |
| `Z` | Zero rated |
| `E` | Exempt from tax |
| `AE` | VAT Reverse Charge |
| `K` | Intra-Community supply |
| `G` | Free export item, tax not charged |
| `O` | Services outside scope of tax |
| `L` | Canary Islands general indirect tax |
| `M` | Tax for production, services and importation in Ceuta and Melilla |

## Common Unit of Measure Codes

| Code | Description |
|---|---|
| `C62` | One (unit/piece) |
| `HUR` | Hour |
| `DAY` | Day |
| `MON` | Month |
| `KGM` | Kilogram |
| `MTR` | Metre |
| `LTR` | Litre |
| `EA` | Each |
| `SET` | Set |
| `XPP` | Piece |
