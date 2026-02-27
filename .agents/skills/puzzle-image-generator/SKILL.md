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
no grid, no segmentation, no labels, no typography. --AR 1:1
```

**Prompt tips**
- Prefer clear shapes and distinct regions (helps puzzle piece separation).
- Avoid tiny repeated patterns, heavy blur, or flat gradients.
- Keep the image self-contained (no frames or letterboxing).
- AI can freely choose any one scene subject and any one style from the 50-option lists below, then combine them in the prompt template.

**Scene subject options (50)**
1. Snowy mountain cabin
2. Sunset beach boardwalk
3. Quiet forest waterfall
4. Desert cactus valley
5. Lavender flower field
6. Tropical coral reef
7. Cozy bookstore interior
8. Vintage train station
9. Bustling night market
10. Medieval castle courtyard
11. Japanese temple garden
12. Colorful hot air balloons
13. Autumn maple park
14. Arctic iceberg bay
15. Rainy city street
16. Seaside lighthouse cliff
17. Wheat farm at dawn
18. Busy fishing harbor
19. Rooftop greenhouse garden
20. Old stone bridge
21. Hidden jungle ruins
22. Canyon river bend
23. Tulip windmill village
24. Glacier lake reflection
25. Safari elephant herd
26. Panda bamboo grove
27. Penguin ice colony
28. Butterfly meadow path
29. Owl in moonlight
30. Farm red barn
31. Snow-covered pine forest
32. Cliffside coastal road
33. Starry desert campsite
34. Cherry blossom avenue
35. Ancient library hall
36. Space station window view
37. Underwater shipwreck scene
38. Carnival ferris wheel
39. City skyline sunrise
40. Rustic kitchen table
41. Pottery studio shelves
42. Mountain goat ridge
43. Camel caravan dunes
44. Vineyard hillside rows
45. Ice cream parlor
46. Pirate ship deck
47. Suburban street in spring
48. Riverside picnic spot
49. Foggy marsh boardwalk
50. Volcano crater rim

**Style options (50)**
1. Photorealistic cinematic lighting
2. Vintage film grain
3. Noir high-contrast monochrome
4. Pastel watercolor wash
5. Bold pop art
6. Retro 80s synthwave
7. Minimalist flat illustration
8. Ukiyo-e woodblock print
9. Art nouveau ornamental
10. Art deco geometric elegance
11. Surreal dreamscape
12. Dark fantasy matte painting
13. Bright kawaii anime
14. Gritty cyberpunk neon
15. Steampunk brass and gears
16. Low-poly 3D render
17. Isometric voxel style
18. Claymation stop-motion look
19. Pencil sketch crosshatching
20. Charcoal drawing texture
21. Ink line art
22. Gouache poster style
23. Oil painting impasto
24. Fresco mural aesthetic
25. Pixel art 16-bit
26. Glitchcore digital distortion
27. Holographic iridescent finish
28. Paper cut collage
29. Stained glass mosaic
30. Hand-drawn doodle style
31. Children's book illustration
32. Botanical scientific illustration
33. Blueprint technical drawing
34. Architectural visualization clean
35. Product studio photography
36. Fashion editorial look
37. Documentary photojournalism
38. Golden hour landscape
39. Moonlit night ambience
40. Misty atmospheric fog
41. Desert dust tones
42. Tropical vibrant palette
43. Scandinavian soft tones
44. Brutalist graphic design
45. Bauhaus primary shapes
46. Japanese zen minimalism
47. Medieval illuminated manuscript
48. Rococo ornate detail
49. Futuristic concept art
50. Hyperreal macro photography

### 2. Generate the image
Run the script with your prompt and optional output folder. If no output folder is provided, the image is saved under `images`.

```bash
node scripts/generate_puzzle_image.js --prompt "YOUR_PROMPT_HERE" --out "optional/output/folder" --name "my-image.png"
```

Use this default numbering logic for `--name` argument:
1. Scan `images/generated-*.png`.
2. Extract numeric suffixes from matching filenames.
3. Compute the next `N` as `max + 1` (default to `1` if no matches exist).
4. Generate with filename `images/generated-{N}.png`.

### 3. Post-image-generation rule
After generating images, derive `N` from current generated files before updating code:
1. Scan `images/generated-*.png`.
2. Extract numeric suffixes and set `N` to the maximum suffix (example: latest is `generated-14.png` => `N = 14`).
3. Replace hard-coded magic numbers with `N`, for example:

```js
const generatedSources = Array.from({ length: 10 }, (_, i) => `images/generated-${i + 1}.png`);
```

```js
const generatedSources = Array.from({ length: N }, (_, i) => `images/generated-${i + 1}.png`);
```

## Script Notes
- Requires `GEMINI_API_KEY` in the environment.
- Expects the Gemini response to include `inlineData.data` (base64 image).
- Saves a `.png` by default and derives the extension from `inlineData.mimeType` when available.
