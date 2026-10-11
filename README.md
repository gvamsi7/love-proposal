# Little Us ♡

A React + TypeScript + Vite proposal website with original SVG bunny artwork, warm paper textures, flip-open love notes, an animated envelope, a personal letter, optional synthesized music, and a heart-confetti celebration.

## Run

Use Node.js 22.13 or later (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Open `http://localhost:4173`. For production, run `npm run build` and deploy `dist/` to any static host. `npm test` verifies personal-link encoding and content handling. The build includes a TypeScript check.

## Personalize

Click **Make it yours** to edit names, the question, the letter, and all three notes. Choose a question preset or write your own. **Save my words** saves in this browser. **Copy personal link** puts the text into a URL fragment, which another browser can read without relying on your local storage. Unicode names and non-English messages are supported.

Anyone with an accessible personal link can read its content; URL fragments are not encryption. If you have enabled Vercel deployment protection, check the production URL's access settings before sharing it.

Default text is an editable illustrative message. Edit `src/content.ts` to change the initial defaults, `src/Illustrations.tsx` for artwork, and `src/styles.css` for the theme. Everything is self-contained: no external fonts, images, audio tracks, or API keys.

## Deploy to Vercel

Import `gvamsi7/love-proposal` into Vercel. The included `vercel.json` configures the Vite framework, `npm ci` installation, `npm run build`, and `dist` output. Use Node.js 24. No environment variables are required. The linked GitHub production branch is `main`; future pushes to it deploy automatically.

## Responses

The answer stays in the current visit; it does not notify the sender or record a response. “I need a little time” opens a kind reply, and both choices stay available. Music is off until the visitor turns it on. Dialogs support keyboard navigation, Escape, and focus restoration. Reduced-motion preferences disable decorative animation.
