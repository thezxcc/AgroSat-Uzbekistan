import {execFileSync} from 'node:child_process'
import {readFileSync,readdirSync,existsSync} from 'node:fs'
import {join,resolve} from 'node:path'
const root=resolve(import.meta.dirname,'..')
const base='/agrosat-subfolder-test/'
const icons=['rotation-a.svg','rotation-b.svg','rotation-c.svg','satellite.svg','rainfall.svg',
 'farmer-next-step.svg','crop-wheat.svg','crop-mungbean.svg','crop-green-manure.svg','crop-cotton.svg']
const maps=['modis_2025_july.png','modis_2025_september.png']
function build(pathBase){
 execFileSync(process.execPath,[join(root,'node_modules/vite/bin/vite.js'),'build'],{
  cwd:root,env:{...process.env,VITE_BASE_PATH:pathBase},stdio:'pipe'
 })
}
try{
 build(base)
 const dist=join(root,'dist'),files=readdirSync(join(dist,'assets'))
 const css=files.filter(n=>n.endsWith('.css')).map(n=>readFileSync(join(dist,'assets',n),'utf8')).join('\n')
 const js=files.filter(n=>n.endsWith('.js')).map(n=>readFileSync(join(dist,'assets',n),'utf8')).join('\n')
 const html=readFileSync(join(dist,'index.html'),'utf8')
 if(!html.includes(base+'assets/'))throw Error('Subfolder base path absent from HTML')
 if(!js.includes(base+'illustrations/crop-'))throw Error('React crop images are not base-aware')
 for(const n of icons){
  if(!existsSync(join(dist,'illustrations',n)))throw Error('Missing built SVG: '+n)
 }
 for(const n of maps){
  if(!existsSync(join(dist,'imagery',n)))throw Error('Missing built MODIS PNG: '+n)
 }
 for(const name of ['rotation-a.svg','rotation-b.svg','rotation-c.svg','satellite.svg','rainfall.svg','farmer-next-step.svg']){
  if(!css.includes(base+'illustrations/'+name))throw Error('CSS image not correctly rebased: '+name)
 }
 if(css.includes('url(/illustrations/')||css.includes('url("/illustrations/'))throw Error('Unrebased absolute CSS asset URL')
 if(js.includes('"/illustrations/crop-'))throw Error('Unrebased absolute React crop image URL')
 console.log('PASS nested deployment assets: 10 SVGs + 2 NASA images copied; all CSS/JS image URLs use '+base)
}finally{
 build('/')
}
const html=readFileSync(join(root,'dist','index.html'),'utf8')
if(!html.includes('/assets/'))throw Error('Default root build was not restored')
console.log('PASS root production build restored')
