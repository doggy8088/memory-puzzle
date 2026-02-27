---
name: puzzle-image-generator
description: Create puzzle-ready background image prompts and generate images via the Gemini image preview API. Use when you need a clean puzzle base image (no text, no puzzle lines) and want a Node.js script to call `generateContent` and save the image to disk.
---

# Puzzle Image Generator

## Overview
Generate a puzzle-ready prompt and render a square (1:1) image using the bundled Node.js script.

## Workflow

### 1. Write the prompt
Use this template and replace the bracketed parts. Keep it concise and literal.

```text
Beautiful [scene subject] in [style], rich detail, balanced composition, high-contrast edges,
clean background, no text, no logos, no watermarks, no borders, no UI, no puzzle lines,
no grid, no segmentation, no labels, no typography.
```

**Prompt tips**
- Prefer clear shapes and distinct regions (helps puzzle piece separation).
- Avoid tiny repeated patterns, heavy blur, or flat gradients.
- Keep the image self-contained (no frames or letterboxing).

### 2. Generate the image
Run the script with your prompt and optional output folder. If no output folder is provided,
the image is saved under `nanobanana-output`.

```bash
node scripts/generate_puzzle_image.js --prompt "YOUR_PROMPT_HERE" --out "optional/output/folder"
```

Optional filename:

```bash
node scripts/generate_puzzle_image.js --prompt "YOUR_PROMPT_HERE" --out "optional/output/folder" --name "my-image.png"
```

## Script Notes
- Requires `GEMINI_API_KEY` in the environment.
- Expects the Gemini response to include `inlineData.data` (base64 image).
- Saves a `.png` by default and derives the extension from `inlineData.mimeType` when available.
