#!/usr/bin/env node
// Extract invoice data from a PDF file using the Invapi API
// Usage: node extract-invoice.js <path-to-pdf-or-image>
//
// Requires: INVAPI_API_KEY environment variable

const fs = require("fs");
const path = require("path");
const { Blob } = require("node:buffer");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node extract-invoice.js <path-to-pdf-or-image>");
  process.exit(1);
}

const apiKey = process.env.INVAPI_API_KEY;
if (!apiKey) {
  console.error("Error: INVAPI_API_KEY environment variable is not set.");
  console.error("Get an API key at https://invapi.org");
  process.exit(1);
}

if (!fs.existsSync(file)) {
  console.error(`Error: File not found: ${file}`);
  process.exit(1);
}

const MIME_TYPES = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const data = fs.readFileSync(file);
const ext = path.extname(file).toLowerCase();
const mimeType = MIME_TYPES[ext] || "application/octet-stream";
const form = new FormData();
form.append("file", new Blob([data], { type: mimeType }), path.basename(file));

fetch("https://api.invapi.org/api/v1/file/json", {
  method: "POST",
  headers: { "x-api-key": apiKey },
  body: form,
})
  .then((res) => res.text())
  .then((text) => console.log(text))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
