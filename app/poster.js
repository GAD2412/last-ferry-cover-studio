// One compositor drives the live proof and lossless PNG. Panel guides belong to the editor overlay.
const formats = {Square:[1080,1080], Portrait:[1080,1350], Wide:[1920,1080]};
const plateLabels = ['Pilot','Coupe','Motel key','Crossing'];
const finishes = {
  'Sunset': ['saturate(1.07) contrast(1.04)', '#ea816a', .035],
  'Neon night': ['saturate(1.36) contrast(1.14) hue-rotate(-12deg)', '#7658c3', .19],
  'Miami pink': ['saturate(1.17) contrast(1.06)', '#f579ae', .21],
  'Noir': ['grayscale(1) contrast(1.3)', '#263749', .12],
  'Gold hour': ['sepia(.32) saturate(1.18) contrast(1.06)', '#ffc976', .14]
};
function panelPolygons(format) {
  if (format === 'Wide') return [
    [[0,0],[.49,0],[.448,1],[0,1]],
    [[.49,0],[1,0],[1,.47],[.469,.52]],
    [[.469,.52],[.736,.495],[.712,1],[.448,1]],
    [[.736,.495],[1,.47],[1,1],[.712,1]]
  ];
  const a = format === 'Portrait' ? .64 : .606;
  return [
    [[0,0],[a+.046,0],[a-.047,1],[0,1]],
    [[a+.046,0],[1,0],[1,.295],[a+.016,.326]],
    [[a+.016,.326],[1,.295],[1,.529],[a-.008,.573]],
    [[a-.008,.573],[1,.529],[1,1],[a-.047,1]]
  ];
}
function panelGeometry(format, width, height) {
  return panelPolygons(format).map(points => {
    const xs=points.map(p=>p[0]*width), ys=points.map(p=>p[1]*height);
    const x=Math.min(...xs), y=Math.min(...ys);
    const path=new Path2D();
    points.forEach((_,i)=>i ? path.lineTo(xs[i],ys[i]) : path.moveTo(xs[i],ys[i]));
    path.closePath();
    return {x,y,w:Math.max(...xs)-x,h:Math.max(...ys)-y,path,points};
  });
}
function transformedPhoto(image, panel, box) {
  const side = panel.turn % 2 === 1;
  const w=side ? image.height : image.width, h=side ? image.width : image.height;
  const scale=Math.max(box.w/w,box.h/h)*panel.zoom;
  const extraX=Math.max(0,w*scale-box.w), extraY=Math.max(0,h*scale-box.h);
  return {scale,extraX,extraY,cx:box.x+box.w/2-panel.x*extraX/2,cy:box.y+box.h/2-panel.y*extraY/2};
}
function paintPanel(ctx,image,panel,box,grade) {
  ctx.save(); ctx.clip(box.path);
  if (image) {
    const t=transformedPhoto(image,panel,box);
    ctx.save(); ctx.translate(t.cx,t.cy); ctx.scale(panel.flip ? -1:1,1); ctx.rotate(panel.turn*Math.PI/2);
    ctx.scale(t.scale,t.scale); ctx.filter=finishes[grade][0];
    ctx.drawImage(image,-image.width/2,-image.height/2); ctx.restore();
    ctx.fillStyle=finishes[grade][1]; ctx.globalCompositeOperation='soft-light'; ctx.globalAlpha=finishes[grade][2]; ctx.fillRect(box.x,box.y,box.w,box.h);
  } else {
    ctx.fillStyle='#314450';ctx.fillRect(box.x,box.y,box.w,box.h);
    ctx.strokeStyle='#415460';ctx.lineWidth=2;ctx.beginPath();
    for(let i=-box.h;i<box.w;i+=20){ctx.moveTo(box.x+i,box.y+box.h);ctx.lineTo(box.x+i+box.h,box.y);}
    ctx.stroke();
  }
  ctx.restore();
}
let grainTile;
function printStock(ctx,w,h,grain,vignette) {
  if (grain) {
    if (!grainTile) {
      grainTile=document.createElement('canvas'); grainTile.width=grainTile.height=128;
      const pen=grainTile.getContext('2d'), pixels=pen.createImageData(128,128);
      let seed=271;
      for(let i=0;i<pixels.data.length;i+=4) {
        seed=seed*16807%2147483647;
        const k=seed%256;
        pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=k;
        pixels.data[i+3]=255;
      }
      pen.putImageData(pixels,0,0);
    }
    ctx.save();ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=grain*.0022;
    ctx.fillStyle=ctx.createPattern(grainTile,'repeat');ctx.fillRect(0,0,w,h);ctx.restore();
  }
  if (vignette) {
    const shade=ctx.createRadialGradient(w*.48,h*.39,Math.min(w,h)*.24,w*.48,h*.47,Math.max(w,h)*.71);
    shade.addColorStop(0,'transparent');shade.addColorStop(1,'rgba(13,20,42,'+(vignette*.008)+')');
    ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
  }
}
function printImprint(ctx,w,h) {
  const u=Math.min(w,h)/1000;
  ctx.save();ctx.scale(u,u);
  const x=29,y=29;
  ctx.fillStyle='#242c40';
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+45,y);ctx.lineTo(x+36,y+12);ctx.lineTo(x+40,y+23);ctx.lineTo(x,y+23);ctx.fill();
  ctx.fillStyle='#ffe2b3';ctx.fill(new Path2D('M34 42h8l7-8h6l-5 8h10l-6 4H34Z'));
  ctx.font='bold 10px Arial,sans-serif';ctx.letterSpacing='2px';ctx.fillStyle='#242c40';ctx.fillText('SABLE SOUND',83,40);
  ctx.font='bold 6.5px Arial,sans-serif';ctx.letterSpacing='2.5px';ctx.fillText('P I C T U R E S',84,51);
  ctx.restore();
}
function renderCover(canvas,settings,images) {
  const [w,h]=formats[settings.format];
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  const ctx=canvas.getContext('2d'), boxes=panelGeometry(settings.format,w,h), u=Math.min(w,h);
  ctx.fillStyle='#1d2639';ctx.fillRect(0,0,w,h);
  boxes.forEach((box,i)=>paintPanel(ctx,images.get(settings.panels[i].source),settings.panels[i],box,settings.grade));
  ctx.strokeStyle='#1c2335';ctx.lineWidth=u*.011;ctx.lineJoin='round';
  boxes.forEach(box=>ctx.stroke(box.path));
  const water=ctx.createLinearGradient(0,h*.70,0,h);
  water.addColorStop(0,'transparent');water.addColorStop(.56,'rgba(24,31,48,.12)');water.addColorStop(1,'rgba(15,24,39,.85)');
  ctx.fillStyle=water;ctx.fillRect(0,h*.7,w,h*.3);
  printStock(ctx,w,h,settings.grain,settings.vignette);
  printImprint(ctx,w,h);
  printCaption(ctx,w,h,settings);
  const margin=u*.033, bottom=h-u*.022;
  ctx.save();ctx.fillStyle='#e2bc99';ctx.font='bold '+(u*.0082)+'px Arial,sans-serif';ctx.letterSpacing=(u*.0016)+'px';
  ctx.fillText('SABLE SOUND   /   COASTAL SERIES',margin,bottom);
  ctx.textAlign='right';ctx.fillText('NIGHT PASSAGE    •    NO. 07',w-margin,bottom);
  ctx.restore();
  ctx.strokeStyle='#1c2335';ctx.lineWidth=u*.015;ctx.strokeRect(0,0,w,h);
}
