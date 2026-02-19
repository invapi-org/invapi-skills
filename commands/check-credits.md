---
name: check-credits
description: Check your Invapi API credit balance
user_invocable: true
---

# Check Credits

Check your remaining Invapi API credits by category.

## Steps

1. **Check API key**: Verify that `INVAPI_API_KEY` is set. If not, tell the user:
   ```
   Set your API key: export INVAPI_API_KEY="your-key"
   Get one at https://invapi.org
   ```

2. **Fetch user info**:
   ```bash
   curl -s https://api.invapi.org/api/v1/user \
     -H "x-api-key: $INVAPI_API_KEY"
   ```

3. **Display results** in a clear format:

   ```
   Invapi Credits
   ──────────────────
   Extraction:  <n> credits
   Conversion:  <n> credits
   Validation:  <n> credits
   QR:          <n> credits
   ```

   Also show the account email and role from the response.
