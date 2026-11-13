// Browser-side, real-time video export. No transcoding service or remote uploads.
export function installGoodScrollVideo(){
  const D=window.WHDCGoodScrollDesign;
  const sourceURL=p=>'/api/good-scroll/image/'+encodeURIComponent(p.image_key);
  let cached=null;
  async function file(p,progress=()=>{},signal){
    if(D.design(p).baked){const response=await fetch(sourceURL(p),{credentials:'same-origin'});if(!response.ok)throw Error('Framed video unavailable.');const blob=await response.blob();return new File([blob],'WHDC-Good-Scroll-'+p.id+'.'+(p.image_key.endsWith('.webm')?'webm':'mp4'),{type:blob.type});}
    const identity=JSON.stringify([p.id,p.updated_at,p.image_key,p.design,p.text,p.reference,p.color,p.background,p.align]);
    if(cached?.identity===identity)return cached.file;
    if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)throw Error('Framed video export is unavailable in this browser. Try a compatible browser or share the post link.');
    const mime=['video/mp4','video/webm;codecs=vp8,opus','video/webm'].find(type=>MediaRecorder.isTypeSupported(type));
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!mime||!Audio)throw Error('This browser cannot export framed video with audio. Try a compatible browser or share the post link.');
    const audio=new Audio(),video=document.createElement('video'),canvas=document.createElement('canvas');
    let stream,recorder,animation,timer,abort;
    try{
      await audio.resume();video.playsInline=true;video.preload='auto';video.src=sourceURL(p);
      await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Video loading timed out.')),20000);video.onloadedmetadata=()=>{clearTimeout(timeout);resolve();};video.onerror=()=>{clearTimeout(timeout);reject(Error('This browser cannot decode the video. Try a compatible browser or share the post link.'));};});
      if(!Number.isFinite(video.duration)||video.duration<=0)throw Error('Video duration is unavailable. Try a compatible browser or share the post link.');
      if(signal?.aborted)throw new DOMException('Export canceled.','AbortError');
      canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');stream=canvas.captureStream(30);
      const destination=audio.createMediaStreamDestination();audio.createMediaElementSource(video).connect(destination);for(const track of destination.stream.getAudioTracks())stream.addTrack(track);
      recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:6000000,audioBitsPerSecond:128000});
      const chunks=[];let bytes=0;
      const completion=new Promise((resolve,reject)=>{
        let failure=null;
        recorder.ondataavailable=e=>{if(e.data.size){chunks.push(e.data);bytes+=e.data.size;if(bytes>50*1024*1024){failure=Error('Framed export exceeded 50 MB. Use a shorter video.');if(recorder.state!=='inactive')recorder.stop();}}};
        recorder.onerror=()=>{failure=Error('Video export failed. Try a compatible browser or share the post link.');if(recorder.state!=='inactive')recorder.stop();else reject(failure);};
        recorder.onstop=()=>failure?reject(failure):chunks.length?resolve(new File(chunks,'WHDC-Good-Scroll-'+p.id+'.'+(mime.startsWith('video/mp4')?'mp4':'webm'),{type:mime})):reject(Error('No video was recorded. Try a compatible browser or share the post link.'));
        abort=()=>{failure=new DOMException('Export canceled.','AbortError');if(recorder.state!=='inactive')recorder.stop();else reject(failure);};signal?.addEventListener('abort',abort,{once:true});
        video.onended=()=>{if(recorder.state!=='inactive')recorder.stop();};
        timer=setTimeout(()=>{failure=Error('Video export timed out. Keep this tab visible and try again.');if(recorder.state!=='inactive')recorder.stop();},Math.min(video.duration*2000+30000,20*60*1000));
      });
      completion.catch(()=>{});
      const draw=()=>{D.drawVideo(ctx,video,p);progress(Math.min(100,Math.round(video.currentTime/video.duration*100)));animation=requestAnimationFrame(draw);};
      await video.play();D.drawVideo(ctx,video,p);recorder.start(1000);draw();
      const result=await completion;cached={identity,file:result};return result;
    }finally{
      clearTimeout(timer);cancelAnimationFrame(animation);signal?.removeEventListener('abort',abort);video.pause();video.removeAttribute('src');video.load();if(recorder&&recorder.state!=='inactive')recorder.stop();stream?.getTracks().forEach(track=>track.stop());await audio.close().catch(()=>{});
    }
  }
  window.WHDCGoodScrollVideo={file};
}
export const GOOD_SCROLL_VIDEO_JS='('+installGoodScrollVideo.toString()+')();';
