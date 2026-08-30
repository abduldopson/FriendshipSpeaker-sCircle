# Ask Friendship Speaker’s Circle — AI Setup

The site works immediately with a built-in club FAQ fallback. To enable generative AI answers:

1. In Vercel, open the Friendship Speaker’s Circle project.
2. Open Settings → Environment Variables.
3. Add `OPENAI_API_KEY` as a Production environment variable.
4. Redeploy the site.
5. The browser sends member questions to `/api/chat`; the API key remains server-side and is never exposed in HTML or JavaScript.

## Safety / cost notes
- Do not put the API key in `script.js`, `site-config.js`, or any public HTML file.
- The endpoint limits member questions to 1,200 characters and model output to 450 tokens.
- Before broad public promotion, add a Vercel rate-limit / firewall rule or another usage control to reduce abuse and unexpected API spend.
- The assistant is instructed not to request or expose confidential member information.
- Official Toastmasters requirements should always be verified with Toastmasters International.
