---
name: convert-invoice
description: Convert an invoice between formats (JSON, UBL, CII, XLSX, ZUGFeRD)
user_invocable: true
---

# Convert Invoice

Convert an invoice between supported formats using the Invapi API.

## Steps

1. **Check API key**: Verify that `INVAPI_API_KEY` is set. If not, tell the user:
   ```
   Set your API key: export INVAPI_API_KEY="your-key"
   Get one at https://invapi.org
   ```

2. **Get source file**: Ask the user for the source file path if not provided as `$ARGUMENTS`. Detect the format:
   - `.json` → Invapi Invoice JSON
   - `.xml` → Check content for UBL (`<Invoice>` root) or CII (`<CrossIndustryInvoice>` root)
   - `.pdf` → Could be a ZUGFeRD PDF

3. **Get target format**: Ask the user what format to convert to. Available conversions:
   - JSON → UBL XML (`POST /api/v1/json/ubl`)
   - JSON → CII XML (`POST /api/v1/json/cii`)
   - JSON → Excel (`POST /api/v1/json/xlsx`) — wraps in `{"invoices": [...]}`
   - JSON + PDF → ZUGFeRD PDF (`POST /api/v1/json/zugferd`) — requires both JSON and PDF
   - UBL XML → JSON (`POST /api/v1/ubl/json`)
   - CII XML → JSON (`POST /api/v1/cii/json`)
   - ZUGFeRD PDF → JSON (`POST /api/v1/zugferd/json`)

4. **Run conversion**: Execute the appropriate curl command. For XML/PDF output, use `-o <filename>` to save the binary.

5. **Report result**: Tell the user the output file location and confirm success.

## Conversion Commands Reference

**JSON → UBL:**
```bash
curl -s -X POST https://api.invapi.org/api/v1/json/ubl \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @invoice.json -o invoice.ubl.xml
```

**JSON → CII:**
```bash
curl -s -X POST https://api.invapi.org/api/v1/json/cii \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @invoice.json -o invoice.cii.xml
```

**UBL → JSON:**
```bash
curl -s -X POST https://api.invapi.org/api/v1/ubl/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/xml" \
  -d @invoice.ubl.xml
```

**CII → JSON:**
```bash
curl -s -X POST https://api.invapi.org/api/v1/cii/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/xml" \
  -d @invoice.cii.xml
```

**JSON → XLSX:**
```bash
curl -s -X POST https://api.invapi.org/api/v1/json/xlsx \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"invoices": ['"$(cat invoice.json)"']}' \
  -o invoices.xlsx
```

**JSON + PDF → ZUGFeRD:**
```bash
curl -s -X POST https://api.invapi.org/api/v1/json/zugferd \
  -H "x-api-key: $INVAPI_API_KEY" \
  -F "file=@invoice.pdf" \
  -F "invoice=$(cat invoice.json)" \
  -o invoice.zugferd.pdf
```

**ZUGFeRD → JSON:**
```bash
curl -s -X POST https://api.invapi.org/api/v1/zugferd/json \
  -H "x-api-key: $INVAPI_API_KEY" \
  -H "Content-Type: application/pdf" \
  --data-binary @invoice.zugferd.pdf
```
