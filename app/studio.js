// Local files, clipboard and drops enter the same four-panel editing workflow.
const byId = id => document.getElementById(id);
const proof = byId('proofCanvas');
const images = new Map(), sources = new Map();
const samplePhotos = [
  {id:'plate-0', label:'Pilot', file:'pilot.jpg', x:.08, y:-.8},
  {id:'plate-1', label:'Coupe', file:'coupe.jpg', x:-.24, y:.12},
  {id:'plate-2', label:'Motel key', file:'key.jpg', x:0, y:0},
  {id:'plate-3', label:'Crossing', file:'crossing.jpg', x:0, y:-.16}
];
const sampleIds = samplePhotos.map(photo=>photo.id);
const freshPanel = (source, x=0, y=0) => ({source,x,y,zoom:1,turn:0,flip:false});
const defaultPanels = () => samplePhotos.map(({id,x,y})=>freshPanel(id,x,y));
let project = {
  format:'Square', caption:'Last Ferry', subtitle:'One crossing before dawn', type:'Harbor Block',
  typeSize:100, placement:'Lower', grade:'Sunset', grain:5, vignette:16, panels:defaultPanels()
};
let active=0, previous=[], future=[], raf=0, noticeTimer, guideTimer, dragging=null, serial=0;
let pendingEdit=null;
const clamp=(n,l,h)=>Math.min(h,Math.max(l,n));
const current=()=>project.panels[active];
const snapshot=()=>JSON.stringify(project);
const decodeImage=src=>new Promise((resolve,reject)=>{
  const image=new Image();
  image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('This image could not be decoded.'));
  image.src=src;
});
function notify(message) {
  const box=byId('status');box.textContent=message;box.classList.add('show');
  clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>box.classList.remove('show'),2900);
}
function remember(before) {
  if(before===snapshot())return;
  previous.push(before);if(previous.length>70)previous.shift();
  future=[];historyControls();
}
function historyControls() {
  const changed=pendingEdit && pendingEdit.before!==snapshot();
  byId('undoBtn').disabled=!previous.length&&!changed;byId('redoBtn').disabled=!future.length||Boolean(changed);
}
function finishInput() {
  if(!pendingEdit)return;
  const {before}=pendingEdit;
  pendingEdit=null;
  remember(before);
  historyControls();
}
function edit(change) {
  finishInput();
  const before=snapshot();change();remember(before);sync();
}
function rewind(undo) {
  finishInput();
  const from=undo?previous:future, to=undo?future:previous;
  if(!from.length)return;
  to.push(snapshot());project=JSON.parse(from.pop());sync();
}
function redraw() {
  if(!raf)raf=requestAnimationFrame(()=>{raf=0;renderCover(proof,project,images);});
}
function fitProof() {
  const mat=byId('mat'), [w,h]=formats[project.format];
  const width=Math.min(mat.clientWidth-30,(mat.clientHeight-31)*w/h);
  const board=byId('artboard');board.style.width=width+'px';board.style.aspectRatio=w+'/'+h;
}
function selectPanel(index,guide=true) {
  active=index;sync();if(guide)showGuide();
}
function showGuide() {
  byId('guide').classList.add('active');clearTimeout(guideTimer);
  guideTimer=setTimeout(()=>byId('guide').classList.remove('active'),1250);
}
function setTab(tab) {
  document.querySelectorAll('[data-tab]').forEach(button=>{
    const on=button.dataset.tab===tab;button.setAttribute('aria-pressed',on);
    byId(button.dataset.tab).hidden=!on;
  });
}
function makeControls() {
  samplePhotos.forEach(({label},i)=>{
    const btn=document.createElement('button');
    btn.setAttribute('aria-label','Select panel '+(i+1)+', '+label);
    btn.innerHTML='<span class="thumb"></span><em></em>';btn.onclick=()=>selectPanel(i);
    byId('panelList').append(btn);
  });
  const colors=[['#f7cc94','#e47d83','#65587a'],['#b56dbb','#5c4b85','#344b70'],['#efb2a7','#e9849f','#986489'],['#d7dbd7','#8e9291','#38444a'],['#f6d38c','#d69c64','#8c6d62']];
  Object.keys(finishes).forEach((name,i)=>{
    const btn=document.createElement('button'),swatch=document.createElement('i');
    swatch.style.background='linear-gradient(115deg,'+colors[i].join(',')+')';
    btn.append(swatch,document.createTextNode(name));btn.onclick=()=>edit(()=>project.grade=name);
    byId('grades').append(btn);
  });
}
function updateLibrary() {
  const library=byId('library');library.replaceChildren(new Option('Choose a source…',''));
  for(const [id,src] of sources)library.add(new Option(src.name,id));
  byId('libraryBox').hidden=![...sources.keys()].some(id=>!sampleIds.includes(id));
}
function sync() {
  for(const [id,value] of Object.entries({quickCaption:project.caption,caption:project.caption,subtitle:project.subtitle,typeface:project.type,placement:project.placement,typeSize:project.typeSize,grain:project.grain,vignette:project.vignette,zoom:Math.round(current().zoom*100)})){
    if(String(byId(id).value)!==String(value))byId(id).value=value;
  }
  for(const [id,key] of [['grainValue','grain'],['vignetteValue','vignette'],['sizeValue','typeSize']])byId(id).value=project[key]+'%';
  byId('zoomValue').value=Math.round(current().zoom*100)+'%';
  byId('projectName').textContent=project.caption.trim()||'Untitled cover';
  byId('formatNote').textContent=formats[project.format].join(' × ')+' PX';
  byId('gradeNote').textContent=project.grade.toUpperCase();
  const labelAt=i=>{
    const p=project.panels[i],src=sources.get(p.source);
    return src?.label || src?.name.replace(/\.[^.]+$/,'') || 'Empty';
  };
  byId('activePanel').textContent='0'+(active+1)+' / '+labelAt(active).toUpperCase();
  byId('library').value=current().source||'';
  byId('flipBtn').setAttribute('aria-pressed',current().flip);
  for(const id of ['flipBtn','rotateBtn','allBtn','zoom','clearBtn'])byId(id).disabled=!current().source;
  byId('downloadBtn').disabled=!project.panels.some(p=>images.has(p.source));
  byId('emptyImport').hidden=!byId('downloadBtn').disabled;
  document.querySelectorAll('[data-format]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.format===project.format));
  [...byId('panelList').children].forEach((b,i)=>{
    const src=sources.get(project.panels[i].source);
    b.setAttribute('aria-pressed',active===i);
    b.children[0].style.backgroundImage=src?'url("'+src.data+'")':'none';
    b.children[0].style.backgroundPosition=src?((1+src.x)*50)+'% '+((1+src.y)*50)+'%':'center';
    b.children[1].textContent='0'+(i+1)+' '+labelAt(i);b.title=src?src.name:'Empty panel — import a photo';
    b.setAttribute('aria-label','Select panel '+(i+1)+', '+labelAt(i));
  });
  [...byId('grades').children].forEach(b=>b.setAttribute('aria-pressed',b.textContent===project.grade));
  byId('guide').firstElementChild.setAttribute('points',panelPolygons(project.format)[active].map(([x,y])=>[x*100,y*100].join(',')).join(' '));
  historyControls();fitProof();redraw();
}
function wireValue(id,set) {
  const el=byId(id);
  el.addEventListener('input',()=>{
    if(pendingEdit?.id!==id){
      finishInput();
      pendingEdit={id,before:snapshot()};
    }
    set(el.value);
    sync();
  });
  el.addEventListener('change',()=>{
    if(pendingEdit?.id===id)finishInput();
    else edit(()=>set(el.value));
  });
  el.addEventListener('blur',()=>{if(pendingEdit?.id===id)finishInput();});
}
function bindEditor() {
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
  document.querySelectorAll('[data-format]').forEach(b=>b.onclick=()=>edit(()=>project.format=b.dataset.format));
  for(const id of ['quickCaption','caption'])wireValue(id,v=>project.caption=v);
  wireValue('subtitle',v=>project.subtitle=v);
  wireValue('zoom',v=>current().zoom=Number(v)/100);
  for(const key of ['grain','vignette','typeSize'])wireValue(key,v=>project[key]=Number(v));
  byId('typeface').onchange=e=>edit(()=>project.type=e.target.value);
  byId('placement').onchange=e=>edit(()=>project.placement=e.target.value);
  byId('flipBtn').onclick=()=>edit(()=>{current().flip=!current().flip;current().x=-current().x;});
  byId('rotateBtn').onclick=()=>edit(()=>{
    const p=current(), oldX=p.x;
    p.turn=(p.turn+1)%4;p.x=p.flip?p.y:-p.y;p.y=p.flip?-oldX:oldX;
  });
  byId('allBtn').onclick=()=>{edit(()=>{const p=current();project.panels=project.panels.map(()=>({...p}));});notify('Source applied to all four panels.');};
  byId('clearBtn').onclick=()=>{edit(()=>project.panels[active]=freshPanel(null));notify('Panel cleared. Import a photo to fill it.');};
  byId('sampleBtn').onclick=()=>{edit(()=>project.panels=defaultPanels());notify('AI-generated sample photos restored.');};
  byId('library').onchange=e=>{const src=sources.get(e.target.value);if(src)edit(()=>project.panels[active]=freshPanel(e.target.value,src.x,src.y));};
  byId('undoBtn').onclick=()=>rewind(true);byId('redoBtn').onclick=()=>rewind(false);
  byId('addBtn').onclick=()=>byId('fileInput').click();
  byId('emptyImport').onclick=()=>byId('fileInput').click();
  byId('fileInput').onchange=e=>{enqueueFiles([...e.target.files]);e.target.value='';};
  byId('downloadBtn').onclick=downloadPng;
  byId('saveBtn').onclick=saveProject;byId('restoreBtn').onclick=restoreProject;
  byId('helpBtn').onclick=()=>byId('shortcuts').showModal();byId('closeHelp').onclick=()=>byId('shortcuts').close();
  new ResizeObserver(fitProof).observe(byId('mat'));
}
function canvasPoint(event) {
  const rect=proof.getBoundingClientRect();
  return [(event.clientX-rect.left)*proof.width/rect.width,(event.clientY-rect.top)*proof.height/rect.height];
}
proof.addEventListener('pointerdown',e=>{
  if(e.button!==0||dragging)return;
  const [x,y]=canvasPoint(e),boxes=panelGeometry(project.format,proof.width,proof.height);
  const i=boxes.findIndex(b=>proof.getContext('2d').isPointInPath(b.path,x,y));
  if(i<0)return;
  selectPanel(i);setTab('panels');proof.focus({preventScroll:true});
  const p=current(),image=images.get(p.source);if(!image){notify('Empty panel. Choose Import photos.');return;}
  const t=transformedPhoto(image,p,boxes[i]);
  dragging={id:e.pointerId,x,y,cx:p.x,cy:p.y,t,before:snapshot()};proof.setPointerCapture(e.pointerId);
});
proof.addEventListener('pointermove',e=>{
  if(!dragging||dragging.id!==e.pointerId)return;
  const [x,y]=canvasPoint(e),d=dragging;
  if(d.t.extraX>0.01)current().x=clamp(d.cx-2*(x-d.x)/d.t.extraX,-1,1);
  if(d.t.extraY>0.01)current().y=clamp(d.cy-2*(y-d.y)/d.t.extraY,-1,1);
  redraw();showGuide();
});
function endDrag(e){if(dragging?.id===e.pointerId){remember(dragging.before);dragging=null;}}
proof.addEventListener('pointerup',endDrag);proof.addEventListener('lostpointercapture',endDrag);

async function smartFocus(image) {
  if('FaceDetector' in window){
    try{
      const detector=new window.FaceDetector({fastMode:true,maxDetectedFaces:4});
      const faces=await Promise.race([detector.detect(image),new Promise(r=>setTimeout(()=>r([]),800))]);
      const best=faces.map(f=>f.boundingBox).sort((a,b)=>b.width*b.height-a.width*a.height)[0];
      if(best)return [clamp((best.x+best.width/2)/image.width*2-1,-1,1),clamp((best.y+best.height*.48)/image.height*2-1,-1,1)];
    }catch{/* Browsers without a local detector use upper-centered portrait framing. */}
  }
  return [0,image.height>image.width?-.48:-.18];
}
async function localPhoto(file) {
  if(!file.type.startsWith('image/'))throw new Error('Choose an image file.');
  const url=URL.createObjectURL(file);let img;
  try{img=await decodeImage(url);}finally{URL.revokeObjectURL(url);}
  const factor=Math.min(1,2800/Math.max(img.width,img.height));
  const bitmap=document.createElement('canvas');bitmap.width=Math.max(1,Math.round(img.width*factor));bitmap.height=Math.max(1,Math.round(img.height*factor));
  const ctx=bitmap.getContext('2d');ctx.fillStyle='#293643';ctx.fillRect(0,0,bitmap.width,bitmap.height);ctx.drawImage(img,0,0,bitmap.width,bitmap.height);
  const data=bitmap.toDataURL('image/jpeg',.95), [x,y]=await smartFocus(bitmap);
  const id='local-'+Date.now().toString(36)+'-'+(++serial);
  return {id,x,y,data,image:bitmap,name:file.name||'Clipboard image'};
}
let importQueue=Promise.resolve();
function enqueueFiles(files) {
  if(!files.length)return;
  const index=active;
  importQueue=importQueue.then(async()=>{
    const imported=[];let errors=0;
    for(const file of files){try{imported.push(await localPhoto(file));}catch{errors++;}}
    if(!imported.length){notify('No readable images. Choose a JPG, PNG, WebP or SVG.');return;}
    for(const {id,image,...record} of imported){sources.set(id,record);images.set(id,image);}
    updateLibrary();
    edit(()=>{imported.slice(0,4).forEach((photo,i)=>project.panels[(index+i)%4]=freshPanel(photo.id,photo.x,photo.y));active=index;});
    setTab('panels');
    notify(imported.length+' photo'+(imported.length===1?'':'s')+' imported'+(errors?' · '+errors+' unreadable file'+(errors===1?'':'s'):'')+'.');
  }).catch(()=>notify('The import could not finish. Try a smaller image.'));
}
let dragDepth=0;
document.addEventListener('dragenter',e=>{if(e.dataTransfer.types.includes('Files')){e.preventDefault();dragDepth++;document.body.classList.add('drag-on');}});
document.addEventListener('dragleave',()=>{if(--dragDepth<=0){dragDepth=0;document.body.classList.remove('drag-on');}});
document.addEventListener('dragover',e=>{if(e.dataTransfer.types.includes('Files'))e.preventDefault();});
document.addEventListener('drop',e=>{e.preventDefault();dragDepth=0;document.body.classList.remove('drag-on');enqueueFiles([...e.dataTransfer.files]);});
document.addEventListener('paste',e=>{
  const files=[...(e.clipboardData?.items||[])].filter(i=>i.kind==='file').map(i=>i.getAsFile()).filter(Boolean);
  if(files.length){e.preventDefault();enqueueFiles(files);}
});

async function downloadPng() {
  try {
    renderCover(proof,project,images);
    const title=(project.caption.trim()||'Untitled').replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'')||'Cover';
    const name=title+'-'+proof.width+'x'+proof.height+'.png';
    const blob=await new Promise(resolve=>proof.toBlob(resolve,'image/png'));if(!blob)throw Error();
    const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=name;link.click();
    setTimeout(()=>URL.revokeObjectURL(link.href),30000);notify('PNG exported · '+name);
  }catch{notify('PNG export failed. Try importing a local photo.');}
}
function openStore() {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open('soundhouse-last-ferry',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('projects');
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  });
}
async function saveProject() {
  try {
    const saved={version:1,project:structuredClone(project),photos:[...sources].filter(([id])=>!sampleIds.includes(id))};
    const database=await openStore();
    await new Promise((resolve,reject)=>{
      const tx=database.transaction('projects','readwrite');tx.objectStore('projects').put(saved,'current');
      tx.oncomplete=resolve;tx.onerror=tx.onabort=()=>reject(tx.error);
    }).finally(()=>database.close());
    notify('Project and photos saved on this device.');
  }catch{notify('Could not save on this device. Check available storage.');}
}
async function restoreProject() {
  try{
    const database=await openStore();
    const data=await new Promise((resolve,reject)=>{
      const request=database.transaction('projects').objectStore('projects').get('current');
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    }).finally(()=>database.close());
    if(!data){notify('No saved project yet. Use Save to keep this cover.');return;}
    const loaded=await Promise.all(data.photos.map(async([id,record])=>[id,record,await decodeImage(record.data)]));
    for(const [id,record,img] of loaded){sources.set(id,record);images.set(id,img);}
    updateLibrary();edit(()=>project=data.project);notify('Saved project restored.');
  }catch{notify('The saved project could not be opened.');}
}
document.addEventListener('keydown',e=>{
  if(byId('shortcuts').open||e.isComposing)return;
  const key=e.key.toLowerCase(),mod=e.ctrlKey||e.metaKey;
  if(mod&&key==='s'){e.preventDefault();saveProject();return;}
  if(mod&&key==='enter'){e.preventDefault();if(!byId('downloadBtn').disabled)downloadPng();return;}
  if(e.target.matches('input,select,textarea'))return;
  if(mod&&(key==='z'||key==='y')){e.preventDefault();rewind(key==='z'&&!e.shiftKey);return;}
  if(mod||e.altKey)return;
  if(/^[1-4]$/.test(key)){selectPanel(Number(key)-1);setTab('panels');return;}
  if(!current().source)return;
  if(['+','=','-'].includes(key)){e.preventDefault();edit(()=>current().zoom=clamp(current().zoom+(key==='-'?-.1:.1),1,3.5));}
  const moves={arrowleft:[.09,0],arrowright:[-.09,0],arrowup:[0,.09],arrowdown:[0,-.09]};
  if(moves[key]){e.preventDefault();edit(()=>{current().x=clamp(current().x+moves[key][0],-1,1);current().y=clamp(current().y+moves[key][1],-1,1);});showGuide();}
});
async function loadSamplePhotos() {
  // Chrome gives file pages opaque origins. Data URLs keep their local canvas exportable.
  if(location.protocol==='file:'){
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='photos/offline-photos.js';script.onload=resolve;script.onerror=reject;
      document.head.append(script);
    });
  }
  const photos=await Promise.all(samplePhotos.map(async photo=>{
    const data=location.protocol==='file:' ? offlinePhotos[photo.file] : 'photos/'+photo.file;
    return {...photo,image:await decodeImage(data)};
  }));
  for(const {id,label,file,image,x,y} of photos){
    images.set(id,image);
    sources.set(id,{label,name:label+' · AI-generated sample',data:'photos/'+file,x,y});
  }
}
async function startStudio() {
  try{
    await loadSamplePhotos();
  }catch{
    project.panels=samplePhotos.map(()=>freshPanel(null));
    byId('sampleBtn').disabled=true;
    notify('Sample photos could not open. Import your photos to start.');
  }
  makeControls();bindEditor();updateLibrary();sync();
}
startStudio();
