#!/usr/bin/env node
// Extract Invoice JSON from a ZUGFeRD PDF
// Usage: node zugferd-to-json.js <invoice.zugferd.pdf>
//
// Requires: INVAPI_API_KEY environment variable

const fs = require("fs");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node zugferd-to-json.js <invoice.zugferd.pdf>");
  process.exit(1);
}

const apiKey = process.env.INVAPI_API_KEY;
if (!apiKey) {
  console.error("Error: INVAPI_API_KEY environment variable is not set.");
  process.exit(1);
}

const body = fs.readFileSync(input);

fetch("https://api.invapi.org/api/v1/zugferd/json", {
  method: "POST",
  headers: {
    "x-api-key": apiKey,
    "Content-Type": "application/pdf",
  },
  body,
})
  .then((res) => res.text())
  .then((text) => console.log(text))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
