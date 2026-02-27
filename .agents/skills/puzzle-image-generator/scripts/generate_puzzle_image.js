#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent";

function printUsage() {
  console.log(
    [
      "Usage:",
      "  node scripts/generate_puzzle_image.js --prompt \"YOUR_PROMPT\" [--out \"output/dir\"] [--name \"file.png\"] [--dry-run]",
      "",
      "Notes:",
      "  - Requires GEMINI_API_KEY env var unless --dry-run is used.",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const args = {
    prompt: null,
    outDir: "nanobanana-output",
    name: null,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--prompt" || arg === "-p") {
      args.prompt = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--out" || arg === "-o") {
      args.outDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--name" || arg === "-n") {
      args.name = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
    if (!args.prompt) {
      args.prompt = arg;
    }
  }

  return args;
}

function safeTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

function pickImagePart(json) {
  const candidates = Array.isArray(json?.candidates) ? json.candidates : [];
  for (const candidate of candidates) {
    const parts = candidate?.content?.parts;
    if (!Array.isArray(parts)) {
      continue;
    }
    for (const part of parts) {
      if (part?.inlineData?.data) {
        return part.inlineData;
      }
    }
  }
  return null;
}

async function main() {
  if (typeof fetch !== "function") {
    console.error("This script requires Node.js 18+ (global fetch).");
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.prompt) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: args.prompt }],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "512",
      },
    },
  };

  if (args.dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY environment variable.");
    process.exit(1);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Request failed: ${response.status} ${response.statusText}`);
    console.error(text);
    process.exit(1);
  }

  const json = await response.json();
  const inlineData = pickImagePart(json);
  if (!inlineData?.data) {
    console.error("No image data found in response.");
    console.error(JSON.stringify(json, null, 2));
    process.exit(1);
  }

  const mimeType = inlineData.mimeType || "image/png";
  const ext = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1] || "png";
  const fileName = args.name || `puzzle-${safeTimestamp()}.${ext}`;

  fs.mkdirSync(args.outDir, { recursive: true });
  const outPath = path.resolve(args.outDir, fileName);
  const buffer = Buffer.from(inlineData.data, "base64");
  fs.writeFileSync(outPath, buffer);

  console.log(outPath);
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
