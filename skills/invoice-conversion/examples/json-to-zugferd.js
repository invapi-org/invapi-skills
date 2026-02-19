#!/usr/bin/env node
// Create a ZUGFeRD PDF from an Invoice JSON and a PDF file
// Usage: node json-to-zugferd.js <invoice.json> <invoice.pdf> [output.pdf]
//
// Requires: INVAPI_API_KEY environment variable

const fs = require("fs");
const path = require("path");
const { Blob } = require("node:buffer");

const invoiceJson = process.argv[2];
const pdfFile = process.argv[3];
if (!invoiceJson || !pdfFile) {
  console.error(
    "Usage: node json-to-zugferd.js <invoice.json> <invoice.pdf> [output.pdf]"
  );
  process.exit(1);
}
const output =
  process.argv[4] || pdfFile.replace(/\.pdf$/, ".zugferd.pdf");

const apiKey = process.env.INVAPI_API_KEY;
if (!apiKey) {
  console.error("Error: INVAPI_API_KEY environment variable is not set.");
  process.exit(1);
}

const invoiceData = fs.readFileSync(invoiceJson, "utf-8");
const pdfData = fs.readFileSync(pdfFile);

const form = new FormData();
form.append("file", new Blob([pdfData], { type: "application/pdf" }), path.basename(pdfFile));
form.append("invoice", invoiceData);

fetch("https://api.invapi.org/api/v1/json/zugferd", {
  method: "POST",
  headers: { "x-api-key": apiKey },
  body: form,
})
  .then((res) => res.arrayBuffer())
  .then((buf) => {
    fs.writeFileSync(output, Buffer.from(buf));
    console.log(`ZUGFeRD PDF written to ${output}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
