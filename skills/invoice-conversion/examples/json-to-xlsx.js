#!/usr/bin/env node
// Convert Invapi Invoice JSON file(s) to an Excel spreadsheet
// Usage: node json-to-xlsx.js <invoice.json> [output.xlsx]
//
// Requires: INVAPI_API_KEY environment variable

const fs = require("fs");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node json-to-xlsx.js <invoice.json> [output.xlsx]");
  process.exit(1);
}
const output = process.argv[3] || "invoices.xlsx";

const apiKey = process.env.INVAPI_API_KEY;
if (!apiKey) {
  console.error("Error: INVAPI_API_KEY environment variable is not set.");
  process.exit(1);
}

// Wrap the invoice in the required {"invoices": [...]} format
const invoice = JSON.parse(fs.readFileSync(input, "utf-8"));
const body = JSON.stringify({ invoices: [invoice] });

fetch("https://api.invapi.org/api/v1/json/xlsx", {
  method: "POST",
  headers: {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  },
  body,
})
  .then((res) => res.arrayBuffer())
  .then((buf) => {
    fs.writeFileSync(output, Buffer.from(buf));
    console.log(`Excel file written to ${output}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
