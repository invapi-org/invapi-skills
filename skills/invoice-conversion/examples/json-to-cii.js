#!/usr/bin/env node
// Convert an Invapi Invoice JSON file to CII XML
// Usage: node json-to-cii.js <invoice.json> [output.xml]
//
// Requires: INVAPI_API_KEY environment variable

const fs = require("fs");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node json-to-cii.js <invoice.json> [output.xml]");
  process.exit(1);
}
const output = process.argv[3] || input.replace(/\.json$/, ".cii.xml");

const apiKey = process.env.INVAPI_API_KEY;
if (!apiKey) {
  console.error("Error: INVAPI_API_KEY environment variable is not set.");
  process.exit(1);
}

const body = fs.readFileSync(input, "utf-8");

fetch("https://api.invapi.org/api/v1/json/cii", {
  method: "POST",
  headers: {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  },
  body,
})
  .then((res) => res.text())
  .then((text) => {
    fs.writeFileSync(output, text);
    console.log(`CII XML written to ${output}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
