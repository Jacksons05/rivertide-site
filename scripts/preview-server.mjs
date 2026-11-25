// Local static preview with the same extensionless page paths as Sites.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
 try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname==='/')pathname='/index.html';
  else if(!path.extname(pathname))pathname+='.html';
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root)){res.writeHead(403).end();return;}
  const body=await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'}).end(body);
 }catch{res.writeHead(404).end('Not found');}
}).listen(Number(process.env.PORT||4183),'127.0.0.1',()=>console.log(`http://127.0.0.1:${process.env.PORT||4183}/`));
