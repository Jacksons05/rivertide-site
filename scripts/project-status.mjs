import {spawnSync} from 'node:child_process';
process.chdir(new URL('..',import.meta.url).pathname);
function run(args){const r=spawnSync(args[0],args.slice(1),{encoding:'utf8',timeout:20000});return r.status===0?r.stdout.trim():`UNAVAILABLE: ${(r.stderr||r.error?.message||'command failed').trim()}`;}
console.log('Checked:',new Date().toISOString());
console.log('Branch:',run(['git','branch','--show-current']));
console.log('Local commit:',run(['git','rev-parse','HEAD']));
console.log('Working tree:',run(['git','status','--short'])||'clean');
const remote=run(['git','remote','get-url','github']);const repo=remote.match(/github.com[:/](.+?)(?:\.git)?$/)?.[1];
if(!repo){console.log('GitHub remote unavailable; remote state unverified.');process.exit(0);}
console.log('Remote main:',run(['gh','api',`repos/${repo}/commits/main`,'--jq','.sha']));
console.log('Open PRs:',run(['gh','pr','list','--repo',repo,'--json','number,title,headRefName,url,statusCheckRollup']));
console.log('Recent deployment records:',run(['gh','api',`repos/${repo}/deployments?per_page=2`,'--jq','.[] | {id,sha,environment}'])||'none exposed by GitHub');
console.log('Production commit: unverified unless hosting deployment metadata is checked separately. A green PR is not proof of release.');
