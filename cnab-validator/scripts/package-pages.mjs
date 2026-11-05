import {mkdir,cp} from 'node:fs/promises';
await mkdir('_site',{recursive:true});for(const name of ['index.html','favicon.svg','.nojekyll','css','js','docs','downloads'])await cp(name,'_site/'+name,{recursive:true});
console.log('Site estático preparado em _site/.');
