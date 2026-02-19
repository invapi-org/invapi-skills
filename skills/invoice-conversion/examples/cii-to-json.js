#!/usr/bin/env node
// Convert a CII XML file to Invapi Invoice JSON
// Usage: node cii-to-json.js <invoice.cii.xml>
//
// Requires: INVAPI_API_KEY environment variable

const fs = require("fs");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node cii-to-json.js <invoice.cii.xml>");
  process.exit(1);
}

const apiKey = process.env.INVAPI_API_KEY;
if (!apiKey) {
  console.error("Error: INVAPI_API_KEY environment variable is not set.");
  process.exit(1);
}

const body = fs.readFileSync(input, "utf-8");

fetch("https://api.invapi.org/api/v1/cii/json", {
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
