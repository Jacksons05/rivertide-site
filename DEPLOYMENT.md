# Deployment

The existing Vercel project is connected to `Jacksons05/rivertide-site` on GitHub.

Vercel runs `node scripts/build-vercel.mjs` and serves `.vercel-site`. The build copies `dist` and changes public links for Vercel without modifying Sites source.

Push release changes to GitHub `main`. Verify the Vercel deployment references the exact commit, reaches READY, and targets production before reporting a release. Use feature branches for preview work. Do not create replacement projects.

The original chatgpt.site deployment is separate and remains unchanged by a Vercel release. Browser-local plans do not migrate between origins automatically; use backup and restore when moving saved data.
