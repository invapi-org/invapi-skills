---
name: validate-invoice
description: Validate a UBL or CII XML invoice against XRechnung 3.0.2 / EN 16931 rules
user_invocable: true
---

# Validate Invoice

Validate a UBL or CII XML invoice against XRechnung 3.0.2 (EN 16931) rules.

## Steps

1. **Check API key**: Verify that `INVAPI_API_KEY` is set. If not, tell the user:
   ```
   Set your API key: export INVAPI_API_KEY="your-key"
   Get one at https://invapi.org
   ```

2. **Get file path**: Ask the user for the XML file path if not provided as `$ARGUMENTS`.

3. **Auto-detect format**: Read the first few lines of the XML file to determine the format:
   - If it contains `CrossIndustryInvoice` → CII format → use `/api/v1/cii/validate`
   - Otherwise → UBL format → use `/api/v1/ubl/validate`

4. **Run validation**:

   **UBL:**
   ```bash
   curl -s -X POST https://api.invapi.org/api/v1/ubl/validate \
     -H "x-api-key: $INVAPI_API_KEY" \
     -H "Content-Type: application/xml" \
     -d @invoice.xml
   ```

   **CII:**
   ```bash
   curl -s -X POST https://api.invapi.org/api/v1/cii/validate \
     -H "x-api-key: $INVAPI_API_KEY" \
     -H "Content-Type: application/xml" \
     -d @invoice.xml
   ```

5. **Display results**:
   - If `valid` is `true`: Report that the invoice is valid and compliant.
   - If `valid` is `false`: List each error from the `errors` array, formatted clearly. Group by rule ID if present (e.g., `[BR-01]`, `[BR-06]`).

6. **Offer guidance**: If validation fails, suggest fixes based on the error messages and offer to help correct the invoice data.
