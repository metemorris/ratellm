# ratellm Chrome extension

See and leave ratellm reviews while browsing Hugging Face model pages.

## Load it (unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select this `extension/` folder.
4. Visit any model page on `huggingface.co` (e.g. `https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3`). A **★ ratellm** button appears in the bottom-right.

## Configure the backend

The extension talks to the ratellm API. Edit `API_BASE` at the top of
`content.js` to point at your running server:

- Local dev: `http://localhost:3000` (default)
- Production: `https://your-domain.com`

The API routes (`/api/models/[...id]/reviews` and `/api/reviews`) send
`Access-Control-Allow-Origin: *`, so the extension can call them from
`huggingface.co`.
