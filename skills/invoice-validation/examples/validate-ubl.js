#!/usr/bin/env node
// Validate a UBL XML invoice against XRechnung 3.0.2 / EN 16931
// Usage: node validate-ubl.js <invoice.ubl.xml>
//
// Requires: INVAPI_API_KEY environment variable

const fs = require("fs");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node validate-ubl.js <invoice.ubl.xml>");
  process.exit(1);
}

const apiKey = process.env.INVAPI_API_KEY;
if (!apiKey) {
  console.error("Error: INVAPI_API_KEY environment variable is not set.");
  process.exit(1);
}

const body = fs.readFileSync(input, "utf-8");

fetch("https://api.invapi.org/api/v1/ubl/validate", {
  method: "POST",
  headers: {
    "x-api-key": apiKey,
    "Content-Type": "application/xml",
  },
  body,
})
  .then((res) => res.text())
  .then((text) => console.log(text))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
