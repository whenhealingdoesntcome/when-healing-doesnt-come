// One 1080×1350 layout for editor, feed and exports. All media comes from the same-origin R2 proxy.
export function installGoodScrollDesign() {
  const defaults={font:'serif',position:'center',image_x:50,image_y:50,zoom:1,mode:'text',fit:'contain',frame:36,video_text:false};
  const fonts={serif:'Georgia, serif',sans:'Arial, sans-serif',rounded:'Verdana, sans-serif'};
  function design(post){try{return {...defaults,...(typeof post.design==='string'?JSON.parse(post.design):post.design||{})}}catch{return {...defaults}}}
  function lines(ctx,text,width){const out=[];for(const paragraph of String(text||'').split('\n')){let line='';for(const word of paragraph.split(/\s+/)){if(ctx.measureText(line+(line?' ':'')+word).width<=width){line+=(line?' ':'')+word;continue;}if(line){out.push(line);line='';}for(const char of word){if(ctx.measureText(line+char).width>width&&line){out.push(line);line='';}line+=char;}}out.push(line);}return out;}
  const images=new Map();
  function loadImage(key){
    if(images.size>=4&&!images.has(key))images.delete(images.keys().next().value);
    if(!images.has(key))images.set(key,new Promise((resolve,reject)=>{const img=new Image();const timeout=setTimeout(()=>{images.delete(key);reject(Error('Image loading timed out. Try again.'));},15000);img.onload=()=>{clearTimeout(timeout);resolve(img);};img.onerror=()=>{clearTimeout(timeout);images.delete(key);reject(Error('Image unavailable. Check the upload before sharing.'));};img.src='/api/good-scroll/image/'+encodeURIComponent(key);}));
    return images.get(key);
  }
  const isVideo=post=>/\.(mp4|webm)$/i.test(post.image_key||'');
  const color=(value,fallback)=>/^#[a-f0-9]{6}$/i.test(value||'')?value:fallback;
  function text(ctx,post,video=false){
    const d=design(post);if(video&&!d.video_text)return;
    ctx.fillStyle=color(post.color,'#405b49');
    const align=['left','center','right'].includes(post.align)?post.align:'center',x=align==='left'?90:align==='right'?990:540;
    ctx.textAlign=align;ctx.textBaseline='top';const family=fonts[d.font]||fonts.serif;
    let size=64,textLines,refs,height;
    do{ctx.font='600 '+size+'px '+family;textLines=lines(ctx,post.text,900);ctx.font=Math.round(size*.62)+'px '+family;refs=post.reference?lines(ctx,post.reference,900):[];height=textLines.length*size*1.3+(refs.length?size*.65+refs.length*size*.82:0);if(height<=990)break;size--;}while(size>=12);
    if(height>990)throw Error('Text is too long for this graphic. Shorten it before publishing.');
    let y=d.position==='top'?160:d.position==='bottom'?1190-height:(1350-height)/2;
    if(video){ctx.save();ctx.globalAlpha=.88;ctx.fillStyle=color(post.background,'#e6ece3');ctx.fillRect(60,y-28,960,height+56);ctx.restore();}
    ctx.fillStyle=color(post.color,'#405b49');ctx.font='600 '+size+'px '+family;
    for(const line of textLines){ctx.fillText(line,x,y);y+=size*1.3;}
    y+=size*.65;ctx.font=Math.round(size*.62)+'px '+family;for(const line of refs){ctx.fillText(line,x,y);y+=size*.82;}
    if(!video){ctx.textAlign='center';ctx.font='22px Arial, sans-serif';ctx.fillText('WHDC · HOPE FOR THE JOURNEY',540,65);ctx.fillText('WHEN HEALING DOESN’T COME',540,1265);}
  }
  function drawVideo(ctx,video,post){
    const d=design(post),f=Math.max(12,d.frame),w=1080-2*f,h=1350-2*f;
    ctx.fillStyle=color(post.background,'#e6ece3');ctx.fillRect(0,0,1080,1350);
    const sw=video.videoWidth,sh=video.videoHeight;if(!sw||!sh)return;
    const scale=(d.fit==='cover'?Math.max:Math.min)(w/sw,h/sh),dw=sw*scale,dh=sh*scale;
    ctx.save();ctx.beginPath();ctx.rect(f,f,w,h);ctx.clip();ctx.drawImage(video,f+(w-dw)*d.image_x/100,f+(h-dh)*d.image_y/100,dw,dh);ctx.restore();text(ctx,post,true);
  }
  function mountVideo(container,post){
    const d=design(post),video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.src='/api/good-scroll/image/'+encodeURIComponent(post.image_key);video.setAttribute('aria-label',post.text||post.title||'Good Scroll video');
    video.style.cssText='position:absolute;inset:0;width:100%;height:100%;box-sizing:border-box;background:'+color(post.background,'#e6ece3')+';object-fit:'+d.fit+';object-position:'+d.image_x+'% '+d.image_y+'%;padding:'+Math.max(12,d.frame)/1080*100+'%';
    if(d.baked){video.style.padding='0';video.style.objectFit='contain';container.replaceChildren(video);return video;}
    const overlay=document.createElement('canvas');overlay.width=1080;overlay.height=1350;overlay.setAttribute('aria-hidden','true');overlay.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';text(overlay.getContext('2d'),post,true);
    container.replaceChildren(video,overlay);return video;
  }
  async function render(canvas,post){
    if(isVideo(post))throw Error('Video posts are exported as video files.');
    const d=design(post),img=post.image_key?await loadImage(post.image_key):null;
    canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Image rendering is unavailable.');
    ctx.fillStyle=color(post.background,'#e6ece3');ctx.fillRect(0,0,1080,1350);
    if(img){if(d.mode==='artwork'){if(img.width*5!==img.height*4)throw Error('Finished cards must have a 4:5 aspect ratio.');ctx.drawImage(img,0,0,1080,1350);return canvas;}const scale=Math.max(1080/img.width,1350/img.height)*d.zoom,w=img.width*scale,h=img.height*scale;ctx.drawImage(img,(1080-w)*d.image_x/100,(1350-h)*d.image_y/100,w,h);ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,0,1080,1350);}
    text(ctx,post);return canvas;
  }
  async function file(post){const canvas=await render(document.createElement('canvas'),post);return new Promise((resolve,reject)=>{try{canvas.toBlob(blob=>blob?resolve(new File([blob],'WHDC-Good-Scroll-'+post.id+'.png',{type:'image/png'})):reject(Error('PNG generation failed.')),'image/png');}catch{reject(Error('This image cannot be exported. Upload it through the WHDC editor.'));}});}
  window.WHDCGoodScrollDesign={render,file,design,defaults,isVideo,drawVideo,mountVideo,text};
}
export const GOOD_SCROLL_DESIGN_JS='('+installGoodScrollDesign.toString()+')();';
