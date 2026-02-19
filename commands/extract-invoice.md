---
name: extract-invoice
description: Extract structured invoice data from a PDF or image file
user_invocable: true
---

# Extract Invoice

Extract structured invoice data from a PDF or image file using the Invapi API.

## Steps

1. **Check API key**: Verify that `INVAPI_API_KEY` is set. If not, tell the user:
   ```
   Set your API key: export INVAPI_API_KEY="your-key"
   Get one at https://invapi.org
   ```

2. **Get file path**: Ask the user for the path to their PDF or image file if not provided as an argument. The argument is available as `$ARGUMENTS`.

3. **Run extraction**: Execute:
   ```bash
   curl -s -X POST https://api.invapi.org/api/v1/file/json \
     -H "x-api-key: $INVAPI_API_KEY" \
     -F "file=@<filepath>"
   ```

4. **Save and display results**: Save the response JSON to a file (e.g., `<original-name>.invoice.json`) and display a summary of the extracted invoice including:
   - Invoice number and date
   - Seller and buyer names
   - Total amount
   - Number of line items

5. **Offer next steps**: Ask if the user wants to:
   - Convert to UBL or CII XML
   - Validate the invoice
   - Export to Excel
   - Create a ZUGFeRD PDF
