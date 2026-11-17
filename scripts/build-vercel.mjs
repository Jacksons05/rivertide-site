import {cp, readdir, readFile, writeFile, rm} from 'node:fs/promises';
import path from 'node:path';
const output = '.vercel-site';
const appOrigin = process.env.RIVERTIDE_APP_ORIGIN || 'https://rivertide-app-jacksongsheehan-7219.vercel.app';
const siteOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null;
await rm(output, {recursive: true, force: true});
await cp('dist', output, {recursive: true});
async function update(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await update(file);
    else if (/\.(html|js|xml|txt|json)$/.test(entry.name)) {
      let content = await readFile(file, 'utf8');
      content = content.replaceAll('https://rivertide-app.jackson-g-sheehan.chatgpt.site', appOrigin);
      if (siteOrigin) content = content.replaceAll('https://rivertide.jackson-g-sheehan.chatgpt.site', siteOrigin);
      await writeFile(file, content);
    }
  }
}
await update(output);
console.log('Vercel marketing build prepared.');
