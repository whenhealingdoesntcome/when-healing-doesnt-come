import { createRemoteJWKSet, jwtVerify } from 'jose';

const denverDay = date => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const yesterdayDenver = () => { const d = denverDay(new Date()); const t = new Date(d+'T12:00:00Z'); t.setUTCDate(t.getUTCDate()-1); return t.toISOString().slice(0,10); };
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
const error = (message, status) => json({error:message},status);
const parseLines = value => String(value || '').split('\n').map(x => x.trim()).filter(Boolean);
const slugify = name => name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);
const decode = row => ({...row, image_urls:JSON.parse(row.image_urls||'[]'), prayer_requests:JSON.parse(row.prayer_requests||'[]'), praise_reports:JSON.parse(row.praise_reports||'[]')});
const encode = v => JSON.stringify(v);
// Redact on the server: never deliver the real name, identifying slug, photos,
// website, location or narrative to public visitors for protected ministries.
const protectedPublic = row => {
  const m=decode(row);
  if(!m.hide_name) return m;
  return {...m,name:'Name Withheld for Security',slug:'protected-'+String(m.id),
    location:'',website_url:'',image_urls:[],mission_statement:'',description:'',
    security_notice:'For the safety of those serving, this ministry’s name has been withheld. Open the prayer card to discover specific ways to pray for their work and the people they serve.'};
};
const validImageUrl = url => /^\/api\/(?:photos|trip-photos)\/[a-z0-9/.-]+$/.test(url) || validHttp(url);
const validHttp = url => { if (!url) return true; try { return ['https:','http:'].includes(new URL(url).protocol); } catch {return false;} };
const configured = env => env.ACCESS_TEAM_DOMAIN?.endsWith('.cloudflareaccess.com') && !env.ACCESS_TEAM_DOMAIN.startsWith('REPLACE_') && env.ACCESS_AUD && !env.ACCESS_AUD.startsWith('REPLACE_') && env.ADMIN_EMAILS && !env.ADMIN_EMAILS.startsWith('REPLACE_');
async function authorized(request,env) {
  if (!configured(env)) return false;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return false;
  try {
    const domain = env.ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//,'').replace(/\/$/,'');
    const jwks = createRemoteJWKSet(new URL(`https://${domain}/cdn-cgi/access/certs`));
    const {payload} = await jwtVerify(token,jwks,{issuer:`https://${domain}`,audience:env.ACCESS_AUD,algorithms:['RS256']});
    return env.ADMIN_EMAILS.split(',').map(s=>s.trim().toLowerCase()).includes(String(payload.email||'').toLowerCase());
  } catch { return false; }
}
async function dataFromRequest(request) {
  let input;
  try { input=await request.json(); } catch {throw new Error('Invalid JSON');}
  const name=String(input.name||'').trim().slice(0,160);
  const category=String(input.category||'');
  if(!name || !['local','national','international'].includes(category)) throw new Error('Name and category are required');
  const arr = key => Array.isArray(input[key]) ? input[key].filter(x=>typeof x==='string').map(x=>x.trim()).filter(Boolean).slice(0,50) : parseLines(input[key]).slice(0,50);
  const image_urls=arr('image_urls');
  const website_url=String(input.website_url||'').trim().slice(0,500);
  const contact_email=String(input.contact_email||'').trim().slice(0,254);
  if(contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email))throw new Error('Enter a valid ministry notification email');
  if(!validHttp(website_url) || image_urls.some(x=>!validImageUrl(x))) throw new Error('Website and image URLs must begin with http:// or https://');
  return {name,category,contact_email,manna_sent:input.manna_sent===true||input.manna_sent===1||input.manna_sent==='1'?1:0,hide_name:input.hide_name===true||input.hide_name===1||input.hide_name==='1'?1:0,location:String(input.location||'').slice(0,200),mission_statement:String(input.mission_statement||'').slice(0,5000),description:String(input.description||'').slice(0,20000),website_url,image_urls,prayer_requests:arr('prayer_requests'),praise_reports:arr('praise_reports')};
}
function renderAdmin() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Manna Missions Admin</title><link rel="stylesheet" href="/admin.css"></head><body><header><a href="/">← Public site</a><strong>MANNA MISSIONS · ADMIN</strong><span>Drafts stay private</span></header><main><section class="panel"><h1>Ministry Editor</h1><p>Create, review, and publish approved ministry profiles. All new entries start as drafts.</p><p><a href="/admin/trips">Manage Mission Trip Reports →</a></p><div id="message" role="status"></div><div class="columns"><aside><button id="new" type="button">+ New ministry</button><div id="list">Loading…</div></aside><form id="editor"><input type="hidden" name="id"><label>Ministry name <input name="name" required maxlength="160"></label><label>Category <select name="category"><option value="local">Local</option><option value="national">National</option><option value="international">International</option></select></label><label class="manna-sent-option"><input type="checkbox" name="manna_sent" value="1"> Manna Sent <span class="hint">Sent from our own church family</span></label><label class="manna-sent-option"><input type="checkbox" name="hide_name" value="1"> Hide Ministry Name for Security Reasons <span class="hint">Public pages will show “Name Withheld for Security” and a brief explanation. Location, photos, website, mission statement and description will also be withheld. Carefully review prayer requests and praise reports for identifying details before publishing.</span></label><label>Location <input name="location"></label><label>Mission statement <textarea name="mission_statement" rows="3"></textarea></label><label>Description <textarea name="description" rows="5"></textarea></label><label>Ministry notification email (private, optional) <input name="contact_email" type="email" maxlength="254" placeholder="ministry@example.org"><span class="hint">Only used for Daily Prayer email updates. Leave blank to skip ministry emails.</span></label><label>Website URL <input name="website_url" type="url" placeholder="https://..."></label><label>Prayer requests (one per line) <textarea name="prayer_requests" rows="5"></textarea></label><label>Praise reports (one per line) <textarea name="praise_reports" rows="5"></textarea></label><div id="nfc-link-panel" class="nfc-link-panel" hidden><label for="nfc-link">Direct prayer card link (future NFC / QR code)</label><div class="nfc-link-controls"><input id="nfc-link" type="text" readonly aria-label="Direct ministry prayer card link"><button id="copy-nfc-link" type="button" class="secondary">Copy link</button></div><p id="nfc-link-status" class="hint">Wait until the church-domain migration before programming tags.</p></div><label>Photos <span class="hint">Select an existing ministry, then upload JPEG, PNG, or WebP images (8 MB maximum each). Changes to photo order or removal are saved with Save changes.</span><input id="photoUpload" type="file" accept="image/jpeg,image/png,image/webp" multiple><div id="photos" class="photos"></div></label><div class="actions"><button type="submit">Save changes</button><button id="publish" type="button" class="secondary" disabled>Publish</button><button id="unpublish" type="button" class="secondary" disabled>Unpublish</button><button id="delete" type="button" class="danger" disabled>Delete ministry</button></div><p id="status">New ministry · Draft</p></form></div></section></main><script src="/admin.js?v=106" defer></script></body></html>`;
}
function renderTripAdmin(){
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Mission Trip Reports Admin</title><link rel="stylesheet" href="/admin.css"><link rel="stylesheet" href="/trip-admin-v22.css"></head><body><header><a href="/admin">← Ministry Editor</a><strong>MISSION TRIP REPORTS · ADMIN</strong><span>Drafts stay private</span></header><main><section class="panel"><h1>Mission Trip Reports</h1><p>Add a trip, upload photos, add up to three optional team member quotes, and publish when ready.</p><div id="trip-message" role="status"></div><div class="columns"><aside><button type="button" id="trip-new">+ New trip report</button><div id="trip-list">Loading…</div></aside><form id="trip-editor"><input type="hidden" name="id"><label>Trip title <input name="title" required maxlength="160"></label><label>Location <input name="location" maxlength="200"></label><label>Trip date or date range <input name="trip_date" maxlength="100" placeholder="June 2026"></label><label>Description <textarea name="description" rows="8" maxlength="20000"></textarea></label><fieldset><legend>Optional team member quotes (up to 3)</legend><label>Quote 1 <textarea name="quote1" rows="2"></textarea></label><label>Team member 1 <input name="name1"></label><label>Quote 2 <textarea name="quote2" rows="2"></textarea></label><label>Team member 2 <input name="name2"></label><label>Quote 3 <textarea name="quote3" rows="2"></textarea></label><label>Team member 3 <input name="name3"></label></fieldset><label>Banner slideshow photos <span class="hint">Save a new trip first, then upload JPEG, PNG or WebP images, up to 24 photos (8 MB each). Drag order using the arrow buttons; save to keep the new order.</span><input id="trip-upload" type="file" accept="image/jpeg,image/png,image/webp" multiple></label><div id="trip-photos" class="photos"></div><div class="actions"><button type="submit">Save changes</button><button id="trip-publish" type="button" class="secondary">Publish</button><button id="trip-unpublish" type="button" class="secondary">Unpublish</button><button id="trip-delete" type="button" class="danger">Delete report</button></div><p id="trip-status">New trip · Draft</p></form></div></section></main><script src="/trip-admin-v22.js" defer></script></body></html>`;
}
const tripDecode=row=>({...row,image_urls:JSON.parse(row.image_urls||'[]'),quotes:JSON.parse(row.quotes||'[]')});
const tripData=input=>{
 const title=String(input.title||'').trim().slice(0,160);
 if(!title)throw new Error('Trip title is required');
 const image_urls=Array.isArray(input.image_urls)?input.image_urls:[];if(image_urls.length>24||image_urls.some(u=>typeof u!=='string'||!validImageUrl(u)))throw new Error('Invalid photo list');
 const quotes=Array.isArray(input.quotes)?input.quotes.slice(0,3).map(q=>({text:String(q?.text||'').trim().slice(0,1200),name:String(q?.name||'').trim().slice(0,120)})).filter(q=>q.text):[];
 return {title,location:String(input.location||'').trim().slice(0,200),trip_date:String(input.trip_date||'').trim().slice(0,100),description:String(input.description||'').trim().slice(0,20000),image_urls,quotes};
};

export default {
 async fetch(request,env) {
  const url=new URL(request.url), path=url.pathname;
  if(path==='/admin' || path==='/admin/' || path==='/admin/trips' || path.startsWith('/api/admin/')) {
    if(!await authorized(request,env)) return error('Unauthorized. Check Cloudflare Access login, Access AUD, team domain, and approved admin email.',403);
    if(path==='/admin' || path==='/admin/') return new Response(renderAdmin(),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-frame-options':'DENY','content-security-policy':"default-src 'self'; img-src 'self' https: data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"}});
    if(path==='/admin/trips') return new Response(renderTripAdmin(),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-frame-options':'DENY','content-security-policy':"default-src 'self'; img-src 'self' https: data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"}});
    if(!env.DB) return error('D1 binding missing',503);
    if(path==='/api/admin/trip-reports' && request.method==='GET'){
      const r=await env.DB.prepare('SELECT * FROM trip_reports ORDER BY updated_at DESC').all();return json(r.results.map(tripDecode));
    }
    if(path==='/api/admin/trip-reports' && request.method==='POST'){
      try{const d=tripData(await request.json()),id=crypto.randomUUID();
       await env.DB.prepare('INSERT INTO trip_reports(id,title,location,trip_date,description,image_urls,quotes) VALUES(?,?,?,?,?,?,?)').bind(id,d.title,d.location,d.trip_date,d.description,encode(d.image_urls),encode(d.quotes)).run();return json({id,status:'draft'},201);
      }catch(e){return error(e.message,400);}
    }
    const tripPhotoMatch=path.match(/^\/api\/admin\/trip-reports\/([a-f0-9-]+)\/photos$/);
    if(tripPhotoMatch && request.method==='POST'){
      if(!env.PHOTOS)return error('R2 PHOTOS binding missing',503);
      const id=tripPhotoMatch[1],record=await env.DB.prepare('SELECT image_urls FROM trip_reports WHERE id=?').bind(id).first();
      if(!record)return error('Trip not found',404);
      const current=JSON.parse(record.image_urls||'[]');if(current.length>=24)return error('Maximum 24 photos per trip',400);
      if(Number(request.headers.get('content-length')||0)>9*1024*1024)return error('Photo too large',413);
      let form;try{form=await request.formData();}catch{return error('Expected photo upload',400);}
      const file=form.get('photo'),types={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
      if(!file||typeof file.arrayBuffer!=='function'||!types[file.type]||file.size<1||file.size>8*1024*1024)return error('Use a JPEG, PNG or WebP photo up to 8 MB',400);
      const bytes=await file.arrayBuffer(),head=new Uint8Array(bytes.slice(0,12));
      const jpg=head[0]===255&&head[1]===216&&head[2]===255,png=head.slice(0,8).join(',')==='137,80,78,71,13,10,26,10',webp=String.fromCharCode(...head.slice(0,4))==='RIFF'&&String.fromCharCode(...head.slice(8,12))==='WEBP';
      if(!(file.type==='image/jpeg'&&jpg||file.type==='image/png'&&png||file.type==='image/webp'&&webp))return error('Invalid image contents',400);
      const key=`trips/${id}/${crypto.randomUUID()}.${types[file.type]}`,photoUrl=`/api/trip-photos/${key}`;
      await env.PHOTOS.put(key,bytes,{httpMetadata:{contentType:file.type}});
      try{
       const r=await env.DB.prepare("UPDATE trip_reports SET image_urls=?,updated_at=datetime('now') WHERE id=? AND image_urls=?").bind(encode([...current,photoUrl]),id,record.image_urls).run();
       if(r.meta?.changes!==1){await env.PHOTOS.delete(key);return error('Photos changed during upload. Refresh.',409);}
      }catch(e){await env.PHOTOS.delete(key);throw e;}
      return json({url:photoUrl},201);
    }
    const tripMatch=path.match(/^\/api\/admin\/trip-reports\/([a-f0-9-]+)(?:\/(publish|unpublish))?$/);
    if(tripMatch){
      const [,id,action]=tripMatch,existing=await env.DB.prepare('SELECT * FROM trip_reports WHERE id=?').bind(id).first();
      if(!existing)return error('Trip not found',404);
      if(action&&request.method==='POST'){
       const status=action==='publish'?'published':'draft';
       await env.DB.prepare("UPDATE trip_reports SET status=?,published_at=CASE WHEN ?='published' THEN datetime('now') ELSE NULL END,updated_at=datetime('now') WHERE id=?").bind(status,status,id).run();return json({ok:true});
      }
      if(!action&&request.method==='PUT'){
       try{const d=tripData(await request.json());
        const prior=JSON.parse(existing.image_urls||'[]');
        if(d.image_urls.some(url=>!prior.includes(url)))return error('Upload photos using the upload control',400);
        await env.DB.prepare("UPDATE trip_reports SET title=?,location=?,trip_date=?,description=?,image_urls=?,quotes=?,updated_at=datetime('now') WHERE id=?").bind(d.title,d.location,d.trip_date,d.description,encode(d.image_urls),encode(d.quotes),id).run();return json({ok:true});
       }catch(e){return error(e.message,400);}
      }
      if(!action&&request.method==='DELETE'){
       let body;try{body=await request.json();}catch{return error('Confirmation required',400);}
       if(body.confirm_delete!==true||body.confirm_title!==existing.title)return error('Deletion confirmation does not match',400);
       await env.DB.prepare('DELETE FROM trip_reports WHERE id=?').bind(id).run();
       let cleanupFailed=false;
       if(env.PHOTOS){try{let cursor;do{const page=await env.PHOTOS.list({prefix:`trips/${id}/`,...(cursor?{cursor}:{})});for(const obj of page.objects)await env.PHOTOS.delete(obj.key);cursor=page.truncated?page.cursor:undefined;}while(cursor);}catch{cleanupFailed=true;}}else cleanupFailed=true;
       return json({ok:true,photo_cleanup_incomplete:cleanupFailed});
      }
    }

    if(path==='/api/admin/ministries' && request.method==='GET') {
      const r=await env.DB.prepare('SELECT * FROM ministries ORDER BY category,name').all();return json(r.results.map(decode));
    }
    if(path==='/api/admin/ministries' && request.method==='POST') {
      try {
        const d=await dataFromRequest(request),id=crypto.randomUUID(),slug=`${slugify(d.name)||'ministry'}-${id.slice(0,8)}`;
        await env.DB.prepare('INSERT INTO ministries (id,name,slug,category,location,mission_statement,description,website_url,image_urls,prayer_requests,praise_reports,manna_sent,hide_name,contact_email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,d.name,slug,d.category,d.location,d.mission_statement,d.description,d.website_url,encode(d.image_urls),encode(d.prayer_requests),encode(d.praise_reports),d.manna_sent,d.hide_name,d.contact_email).run();return json({id,slug,status:'draft'},201);
      } catch(e) {return error(e.message,400);}
    }
    const photoMatch=path.match(/^\/api\/admin\/ministries\/([a-f0-9-]+)\/photos$/);
    if(photoMatch && request.method==='POST') {
      if(!env.PHOTOS) return error('R2 PHOTOS binding missing',503);
      const id=photoMatch[1];
      const record=await env.DB.prepare('SELECT image_urls FROM ministries WHERE id=?').bind(id).first();
      if(!record)return error('Ministry not found',404);
      const current=JSON.parse(record.image_urls||'[]');
      if(current.length>=24)return error('Maximum 24 photos per ministry',400);
      const length=Number(request.headers.get('content-length')||0);
      if(length>9*1024*1024)return error('File is too large (8 MB maximum)',413);
      let form;try{form=await request.formData();}catch{return error('Expected multipart form upload',400);}
      const file=form.get('photo');
      if(!file || typeof file.arrayBuffer!=='function')return error('Select a photo',400);
      const types={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
      if(!types[file.type])return error('Only JPEG, PNG and WebP photos are allowed',400);
      if(file.size<1 || file.size>8*1024*1024)return error('File must be 8 MB or smaller',413);
      const bytes=await file.arrayBuffer();
      const head=new Uint8Array(bytes.slice(0,12));
      const jpg=head[0]===255&&head[1]===216&&head[2]===255;
      const png=head.slice(0,8).join(',')==='137,80,78,71,13,10,26,10';
      const webp=String.fromCharCode(...head.slice(0,4))==='RIFF'&&String.fromCharCode(...head.slice(8,12))==='WEBP';
      if(!(file.type==='image/jpeg'&&jpg || file.type==='image/png'&&png || file.type==='image/webp'&&webp))return error('File contents do not match image type',400);
      const key=`${id}/${crypto.randomUUID()}.${types[file.type]}`;
      await env.PHOTOS.put(key,bytes,{httpMetadata:{contentType:file.type},customMetadata:{ministryId:id}});
      const photoUrl=`/api/photos/${key}`;
      try {
        const updated=await env.DB.prepare("UPDATE ministries SET image_urls=?,updated_at=datetime('now') WHERE id=? AND image_urls=?").bind(JSON.stringify([...current,photoUrl]),id,record.image_urls).run();
        if(updated.meta?.changes!==1){await env.PHOTOS.delete(key);return error('Ministry photos changed during upload. Refresh and retry.',409);}
      } catch(e){await env.PHOTOS.delete(key);throw e;}
      return json({url:photoUrl},201);
    }
    const match=path.match(/^\/api\/admin\/ministries\/([a-f0-9-]+)(?:\/(publish|unpublish))?$/);
    if(match){const [,id,action]=match;const existing=await env.DB.prepare('SELECT id FROM ministries WHERE id=?').bind(id).first();if(!existing)return error('Not found',404);
      if(action && request.method==='POST') {
        await env.DB.prepare("UPDATE ministries SET status=?, published_at=CASE WHEN ?='published' THEN datetime('now') ELSE NULL END, updated_at=datetime('now') WHERE id=?").bind(action==='publish'?'published':'draft',action==='publish'?'published':'draft',id).run();return json({ok:true});
      }
      if(!action && request.method==='DELETE') {
        // Only a confirmed, authenticated admin request can permanently delete a ministry.
        const row=await env.DB.prepare('SELECT name,status,image_urls FROM ministries WHERE id=?').bind(id).first();
        if(!row)return error('Not found',404);
        let payload;
        try {payload=await request.json();}catch{return error('Confirmation required',400);}
        if(payload.confirm_name!==row.name || payload.confirm_delete!==true)
          return error('Deletion confirmation does not match the ministry name',400);
        // Remove the D1 record first so the ministry and all its photos become inaccessible.
        await env.DB.prepare('DELETE FROM ministries WHERE id=?').bind(id).run();
        // Clean up R2 objects belonging to this ministry. External URLs are never touched.
        let removedPhotos=0, cleanupFailed=false;
        if(env.PHOTOS) {
          try {
            let cursor;
            do {
              const page=await env.PHOTOS.list({prefix:`${id}/`,...(cursor?{cursor}:{})});
              for(const obj of page.objects) {
                await env.PHOTOS.delete(obj.key);
                removedPhotos++;
              }
              cursor=page.truncated?page.cursor:undefined;
            } while(cursor);
          } catch {cleanupFailed=true;}
        } else cleanupFailed=true;
        return json({ok:true,deleted_id:id,removed_photos:removedPhotos,photo_cleanup_incomplete:cleanupFailed});
      }
      if(!action && request.method==='PUT') {
        try {
          const d=await dataFromRequest(request);
          const previous=await env.DB.prepare('SELECT image_urls FROM ministries WHERE id=?').bind(id).first();
          const previousUrls=JSON.parse(previous.image_urls||'[]');
          // Uploaded photos must belong to this ministry. Prevent arbitrary URL insertion.
          const ownPrefix=`/api/photos/${id}/`;
          if(d.image_urls.some(url=>url.startsWith('/api/photos/')&&!url.startsWith(ownPrefix)))return error('Photo belongs to another ministry',400);
          if(d.image_urls.some(url=>url.startsWith(ownPrefix)&&!previousUrls.includes(url)))return error('Upload photos using the upload control',400);
          const updated=await env.DB.prepare("UPDATE ministries SET name=?,category=?,location=?,mission_statement=?,description=?,website_url=?,image_urls=?,prayer_requests=?,praise_reports=?,manna_sent=?,hide_name=?,contact_email=?,updated_at=datetime('now') WHERE id=? AND image_urls=?").bind(d.name,d.category,d.location,d.mission_statement,d.description,d.website_url,encode(d.image_urls),encode(d.prayer_requests),encode(d.praise_reports),d.manna_sent,d.hide_name,d.contact_email,id,previous.image_urls).run();
          if(updated.meta?.changes!==1)return error('Photos changed since editing. Refresh and retry.',409);
          const removed=previousUrls.filter(url=>url.startsWith(ownPrefix)&&!d.image_urls.includes(url));
          let cleanupFailed=false;
          for(const url of removed){
            const m=url.match(/^\/api\/photos\/([a-f0-9-]{36})\/([a-f0-9-]{36}\.(?:jpg|png|webp))$/);
            if(m&&m[1]===id){try{if(!env.PHOTOS)throw new Error('Missing R2');await env.PHOTOS.delete(`${id}/${m[2]}`);}catch{cleanupFailed=true;}}
          }
          return json({ok:true,removed_photos:removed.length,photo_cleanup_incomplete:cleanupFailed});
        } catch(e){return error(e.message,400);}
      }
    }
    return error('Not found',404);
  }
  const tripPhoto=path.match(/^\/api\/trip-photos\/trips\/([a-f0-9-]{36})\/([a-f0-9-]{36})\.(jpg|png|webp)$/);
  if(tripPhoto && request.method==='GET'){
    if(!env.DB||!env.PHOTOS)return error('Photo storage unavailable',503);
    const id=tripPhoto[1],key=`trips/${id}/${tripPhoto[2]}.${tripPhoto[3]}`;
    const record=await env.DB.prepare('SELECT status,image_urls FROM trip_reports WHERE id=?').bind(id).first();
    if(!record||!JSON.parse(record.image_urls||'[]').includes(path))return error('Photo not found',404);
    if(record.status!=='published'&&!await authorized(request,env))return error('Photo not found',404);
    const object=await env.PHOTOS.get(key);if(!object)return error('Photo not found',404);
    return new Response(object.body,{headers:{'content-type':object.httpMetadata?.contentType||'application/octet-stream','cache-control':record.status==='published'?'public, max-age=300':'private, no-store','x-content-type-options':'nosniff'}});
  }
  if(path==='/api/trip-reports'&&request.method==='GET'){
    if(!env.DB)return error('Database unavailable',503);
    const r=await env.DB.prepare("SELECT title,location,trip_date,description,image_urls,quotes FROM trip_reports WHERE status='published' ORDER BY trip_date DESC,updated_at DESC").all();return json(r.results.map(tripDecode));
  }
  const servedPhoto=path.match(/^\/api\/photos\/([a-f0-9-]{36})\/([a-f0-9-]{36})\.(jpg|png|webp)$/);
  if(servedPhoto && request.method==='GET') {
    if(!env.DB || !env.PHOTOS)return error('Photo storage unavailable',503);
    const id=servedPhoto[1], key=`${id}/${servedPhoto[2]}.${servedPhoto[3]}`;
    const record=await env.DB.prepare('SELECT status,image_urls,hide_name FROM ministries WHERE id=?').bind(id).first();
    if(!record || !JSON.parse(record.image_urls||'[]').includes(path))return error('Photo not found',404);
    if((record.status!=='published'||record.hide_name) && !await authorized(request,env))return error('Photo not found',404);
    const object=await env.PHOTOS.get(key);
    if(!object)return error('Photo not found',404);
    return new Response(object.body,{headers:{'content-type':object.httpMetadata?.contentType||'application/octet-stream','cache-control':record.status==='published'?'public, max-age=300':'private, no-store','x-content-type-options':'nosniff','content-security-policy':"default-src 'none'; sandbox"}});
  }
  if(path==='/api/prayer-report' && request.method==='GET') {
    if(!env.PRAYER_REPORT_SECRET || request.headers.get('Authorization')!==`Bearer ${env.PRAYER_REPORT_SECRET}`)return error('Unauthorized',401);
    const day=yesterdayDenver();
    const rotation=await env.DB.prepare('SELECT ministry_slug FROM daily_ministry_rotations WHERE day=?').bind(day).first();
    const ministry=rotation?await env.DB.prepare('SELECT id,name,hide_name,contact_email FROM ministries WHERE slug=?').bind(rotation.ministry_slug).first():null;
    const count=ministry?(await env.DB.prepare('SELECT COUNT(*) AS n FROM daily_prayer_clicks WHERE day=? AND ministry_id=?').bind(day,ministry.id).first()).n:0;
    return json({date:day,ministry:ministry?{name:ministry.name,hide_name:Boolean(ministry.hide_name),email:ministry.contact_email||''}:null,count});
  }
  if(path==='/api/daily-prayer-count' && request.method==='GET') {
    const day=denverDay(new Date());
    const rotation=await env.DB.prepare('SELECT ministry_slug FROM daily_ministry_rotations WHERE day=?').bind(day).first();
    if(!rotation)return json({date:day,count:0});
    const ministry=await env.DB.prepare("SELECT id FROM ministries WHERE slug=? AND status='published'").bind(rotation.ministry_slug).first();
    if(!ministry)return json({date:day,count:0});
    const count=(await env.DB.prepare('SELECT COUNT(*) AS n FROM daily_prayer_clicks WHERE day=? AND ministry_id=?').bind(day,ministry.id).first()).n;
    return json({date:day,count});
  }
  if(path==='/api/daily-prayer-count' && request.method==='POST') {
    const origin=request.headers.get('Origin');
    if(origin && origin!==new URL(request.url).origin)return error('Origin not allowed',403);
    if(!['application/json'].some(t=>(request.headers.get('Content-Type')||'').startsWith(t)))return error('JSON required',415);
    let body;try{body=await request.json();}catch{return error('Invalid JSON',400);}
    if(typeof body.token!=='string'||!/^[-_a-zA-Z0-9]{20,100}$/.test(body.token))return error('Invalid prayer token',400);
    const day=denverDay(new Date());
    const rotation=await env.DB.prepare('SELECT ministry_slug FROM daily_ministry_rotations WHERE day=?').bind(day).first();
    if(!rotation)return error('Daily ministry not ready',409);
    const ministry=await env.DB.prepare("SELECT id FROM ministries WHERE slug=? AND status='published'").bind(rotation.ministry_slug).first();
    if(!ministry)return error('Daily ministry unavailable',409);
    const tokenBytes=new TextEncoder().encode(`${body.token}:${day}:${ministry.id}`);
    const digest=await crypto.subtle.digest('SHA-256',tokenBytes);
    const fingerprint=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    const inserted=await env.DB.prepare('INSERT OR IGNORE INTO daily_prayer_clicks(day,ministry_id,visitor_hash) VALUES(?,?,?)').bind(day,ministry.id,fingerprint).run();
    const count=(await env.DB.prepare('SELECT COUNT(*) AS n FROM daily_prayer_clicks WHERE day=? AND ministry_id=?').bind(day,ministry.id).first()).n;
    return json({date:day,count,recorded:inserted.meta?.changes===1});
  }
  if(path==='/api/ministry-of-the-day' && request.method==='GET') {
    if(!env.DB)return error('Database unavailable',503);
    // One calendar day for every visitor, based on the church's Colorado timezone.
    const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const ministries=(await env.DB.prepare("SELECT name,slug,category,location,mission_statement,description,website_url,image_urls,prayer_requests,praise_reports,manna_sent,hide_name,id FROM ministries WHERE status='published' ORDER BY slug").all()).results;
    if(!ministries.length)return json({date:day,ministry:null,total:0,cycle:0});
    const existing=await env.DB.prepare('SELECT ministry_slug,cycle FROM daily_ministry_rotations WHERE day=?').bind(day).first();
    let chosen=existing&&ministries.find(m=>m.slug===existing.ministry_slug);
    let cycle=existing?.cycle||1;
    if(!chosen){
      const latest=await env.DB.prepare('SELECT MAX(cycle) AS cycle FROM daily_ministry_rotations').first();
      cycle=latest?.cycle||1;
      const used=(await env.DB.prepare('SELECT ministry_slug FROM daily_ministry_rotations WHERE cycle=?').bind(cycle).all()).results.map(r=>r.ministry_slug);
      chosen=ministries.find(m=>!used.includes(m.slug));
      if(!chosen){cycle++;chosen=ministries[0];}
      await env.DB.prepare('INSERT INTO daily_ministry_rotations(day,ministry_slug,cycle) VALUES(?,?,?) ON CONFLICT(day) DO UPDATE SET ministry_slug=excluded.ministry_slug,cycle=excluded.cycle').bind(day,chosen.slug,cycle).run();
    }
    return json({date:day,ministry:protectedPublic(chosen),total:ministries.length,cycle});
  }
  if(path==='/api/ministries' && request.method==='GET') {
    if(!env.DB) return error('Database unavailable',503);
    const r=await env.DB.prepare("SELECT name,slug,category,location,mission_statement,description,website_url,image_urls,prayer_requests,praise_reports,manna_sent,hide_name,id,updated_at FROM ministries WHERE status='published' ORDER BY category,name").all();return json(r.results.map(protectedPublic));
  }
  if(path.startsWith('/api/'))return error('Not found',404);
  return env.ASSETS.fetch(request);
 }
};
