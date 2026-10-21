// Add your payment links here when ready. Leave blank to display a coming-soon message.
const SUPPORT_VENMO_URL='https://venmo.com/u/whenhealingdoesntcome';
const SUPPORT_SQUARE_URL='';
const DEVOTIONAL_OUTLINE={"Identity":["Who Am I?","I Am Chosen","I Am Loved","I Am Adopted","I Am Known","I Am a Saint","I Am Beautiful","I Am Enough","I Am Not My Own","I Am Not Alone","I Am Not My Social Media","Jehovah Tsidkenu - The Lord Our Righteousness"],"Rest":["What is Rest?","I’m Tired of Resting","Am I Lazy?","Rest for the Soul","Limitations","Using My Limitations for Good","Being a Mary","Sabbath","The Art of Listening","Apart from Me, You Can Do Nothing","Producing Fruit","Jehovah Jireh - The Lord Will Provide"],"Anxiety":["How Long Oh Lord?","How Am I Going to Pay My Bills?","What if I Never Get Better?","What if…","Am I Faking?","Dying","What About My Dreams?","When Sin Runs Deep","Filled with Truth","Rejecting the Lies","Can You Hear Me?","Jehovah Nissi - The Lord My Banner"],"Peace":["I Need Peace","Calming the Storm","Beyond My Understanding","God’s History","My History","Peace Like a River","God is My Vine","Abiding","Drowning Out the Noise","What is Peace?","Asleep on the Boat","Jehovah Shalom - The Lord Is Peace"],"Loneliness":["Where are My Friends?","Where is God?","Nobody Understands","The Hidden Sickness","Hearing God’s Voice","Uninvited","Held","Quietness","Alone","Help!","Faithful","Jehovah Shammah - The Lord Is There"],"Community":["I Have Today","The Little Things","The Next Thing","Living in my Limitations","Building God’s Kingdom","The Church","When the Church is Broken","All We Need is Jesus","Gentleness","Better Together","Dumb Sheep","Jehovah Raah - The Lord My Shepherd"],"Depression":["Why Are You Downcast, O My Soul","Light in the Darkness","When I Can’t See","The Valley of the Shadow of Death","Broken-hearted","The Mountain Top","Lost in the Depths","Storm Clouds","No More Tears","Silence","Deer in the Headlights","El Roi - The Lord Who Sees"],"Praise":["When no Fruit in on the Vine","Worship is my weapon","Sing His Praise","Sunrise","Sunset","Mountains","Perspective","Bigger Than","Seasons","All Creation Sings His Praise","Sacrifice of Praise","El Elyon - The God Most High"],"Frustration":["How long?","Why Me?","Why Now?","I Have Things I Want to Do","I Have Things I Need to Do","How Does This Help the Kingdom?","Not By My Strength","Not Again!","Set Back","Every New Battle","Shallow","El Deah - The God of Knowledge"],"Contentment":["Godliness with Contentment","Paul","I Can Do All Things","Every Good and Perfect Gift","He Knows","Sacrifice","It is Well With My Soul","His Bank Account","Work in Progress","All My Plans","Count It As Loss","Jehovah Mekoddishkem - The Lord Who Sanctifies You"],"Fear":["When I Am Afraid","Fear of Man","Fear of God","Fear of Evil","Faith over Fear","Fear of Sickness","Fear of Death","Fear of Sin","Knowing the Enemy","Armor of God","Battle Belongs to the Lord","Jehovah Tsuri - The Lord Our Rock"],"Joy":["Joy vs Happiness","Joy Made Full","Where is Joy?","Lamentations","Made for More","Repentance","Joy of the Lord is My Strength","I Lift My Eyes Up","The Joy Set Before Him","Filled to Overflowing","Joy Comes in the Morning","Jehovah Elohim - The Lord the Creator"],"Grief":["Denial","Loss of Independence","Loss of Ability","Loss of Security","Loss of Community","Loss of Capacity","Anger","Acceptance","Can I Go On?","Empty","Weeping","El Gibhor - The Mighty God"],"Hope":["Living for Eternity","Living in the Present","Living in Light of the Past","Hope Comes Down","Heaven","Heart Made Whole","Working All Things Together for Good","Holy, Holy, Holy","Press On","Hope Does Not Disappoint","Why Hope?","Jehovah Ma’on - The Lord Our Dwelling Place"],"Suffering":["Pain","Sorrow","Loss","Weakness","Overcoming","Never Wasted","God is Always Good…","But It Doesn’t Always Feel That Way","Job","Like Gold","Endurance","Abba - Daddy"],"Surrender":["Surrender vs Obedience","Surrender Feels Scary","Knowing God","Trusting God","Full Surrender","Like a River","The Straw","Yield","A Heart Like His","Take Me Deeper","God’s Will","Adonai - Lord, Master"],"Waiting":["What is Waiting?","Why Wait?","Waiting is an Art","Joy in the Waiting","Patience is a Virtue","Still?","Tired.","A Light for Each Step","Merging","This Moment","Treasures of Darkness","Alpha and Omega - The Beginning and The End"],"Healing":["Why Sickness and Pain?","Praying in Faith","Why Won’t You Heal Me?","Touching the Hem","I Believe, Help My Unbelief","Healing Will Come…","But It Might Not Be Today","This Light and Momentary Affliction","It Doesn’t Feel Light","It Doesn’t Feel Momentary","Glory to Glory","Jehovah Rapha - The Lord That Heals"],"Purpose":["Why Am I Here?","Purposes of God","Made on Purpose for a Purpose","Purpose in Suffering","Mindfulness","Living Sacrifice","Discipline is Good","Loving God with all My Strength","Loving God with all My Heart","Loving God with all My Mind","Loving God with all My Soul","El Chuwl - The God who Gave You Birth"],"Living with Limits":["Planning","Interruptible","Bad Days","Good Days","The Inbetween","Pushing Myself","One Step","Thankful for the Little Things","Thankfulness as a Lifestyle","Mind Control","El Chay - Living God"],"Working through Chronic Illness":["Fallen World","Unrepentant Sin","Bitterness","Demonic","Unhealthy Habits","Test of Faith","Glory of God","Our Body Is a Temple","Protecting Our Minds","Desert Places","Overwhelmed","Attiyq Youm - Ancient of Days"]};
const $=s=>document.querySelector(s);const KEY='whdc-drafts-v1',FAV='whdc-favorites-v1';let scriptureRef='',scriptureURL='',scriptureLoading=false,scriptureData=null,scriptureError='',scriptureForId=null,scriptureOpen=false;let data=[],view='home',selectedTopic='All',currentId=null,editingId=null;const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const formatInline=s=>safe(s).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>');const para=s=>String(s||'').split(/\n\s*\n/).map(x=>`<p>${formatInline(x).replace(/\n/g,'<br>')}</p>`).join('');const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};const READ_KEY='whdc-read-history-v1';
// The selected devotional survives reloads in this tab, but not a new browsing session.
const OPEN_DEVOTIONAL_KEY='whdc-open-devotional-tab-v1';
const devotionalHash=id=>'#devotional/'+encodeURIComponent(id);
function rememberOpenDevotional(id){sessionStorage.setItem(OPEN_DEVOTIONAL_KEY,String(id));history.pushState(null,'',devotionalHash(id))}
async function shareDevotional(d){
 const url=new URL(devotionalHash(d.id),location.origin+'/').href;
 const message=`I thought you might enjoy this devotional from When Healing Doesn't Come!\n\nTitle: ${d.title}\n\n${url}`;
 // Sending a single text field (including the URL) works more reliably with iOS Messages.
 if(navigator.share){
  try{await navigator.share({title:' ',text:message});return}
  catch(error){if(error?.name==='AbortError')return}
 }
 try{await navigator.clipboard.writeText(message);alert('Devotional message and link copied!')}
 catch{prompt('Copy this devotional message and link:',message)}
}
function clearOpenDevotional(){sessionStorage.removeItem(OPEN_DEVOTIONAL_KEY)}
const readHistory=()=>load(READ_KEY,{});
const readDate=id=>readHistory()[id]||'';
function toggleRead(id){const history=readHistory();if(history[id])delete history[id];else history[id]=new Date().toLocaleDateString('en-CA');localStorage.setItem(READ_KEY,JSON.stringify(history));}
// Devotional of the Day: one shared, deterministic rotation based on Mountain Time.
// All visitors with the same published collection see the same devotional.
function pickDate(){
 return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
}
function dailyPick(items){
 const eligible=items.filter(d=>d.status!=='draft'&&d.status!=='unpublished');
 if(!eligible.length)return null;
 const ordered=[...eligible].sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 const date=pickDate();
 const parts=date.match(/(\d{4})-(\d{2})-(\d{2})/);
 if(!parts)return ordered[0];
 const dayNumber=Math.floor(Date.UTC(Number(parts[1]),Number(parts[2])-1,Number(parts[3]))/86400000);
 return ordered[((dayNumber%ordered.length)+ordered.length)%ordered.length];
}
// Recheck when a visitor returns to an open tab after the Mountain Time date changes.
let displayedPickDate='';
function refreshDailyPick(){
 const today=pickDate();
 if(today===displayedPickDate)return;
 displayedPickDate=today;
 const next=dailyPick(data);
 if(!next)return;
 if(view==='today'&&location.hash.startsWith('#devotional/'))return;
 currentId=next.id;
 if(view==='today')render();
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&data.length)refreshDailyPick()});
window.addEventListener('focus',()=>{if(data.length)refreshDailyPick()});
const readBadge=id=>readDate(id)?`<span class="read-badge" title="Last read ${safe(readDate(id))}">✓ Read · ${safe(readDate(id))}</span>`:'';
const favs=()=>load(FAV,[]);const saveFavs=v=>localStorage.setItem(FAV,JSON.stringify(v));function current(){return data.find(x=>x.id===currentId)||data[0]};const START_PAGE_KEY='whdc-opening-page-v1',VISITED_KEY='whdc-visited-v1';
const openingPage=()=>localStorage.getItem(START_PAGE_KEY)==='home'?'home':'today';
const installedApp=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
async function shareThisApp(){
 const url=new URL('/get-app.html',location.origin).href;
 const message=`I thought you might enjoy When Healing Doesn't Come, a free devotional app offering biblical encouragement and hope for life's hardest seasons.\n${url}`;
 // Keep the invitation and link together: some iOS share targets drop text when URL is supplied separately.
 if(navigator.share){
  try{await navigator.share({text:message});return}catch(error){if(error&&error.name==='AbortError')return;console.warn('App sharing unavailable',error)}
 }
 try{await navigator.clipboard.writeText(message);alert('App invitation and link copied. You can paste them into a message.')}catch(error){prompt('Copy this app invitation:',message)}
}

function notificationSettings(){return `<section class="card whdc-notifications" style="max-width:760px;margin:0 auto 2rem"><h2>Notifications</h2><p class="muted small">Optional reminders and What's New announcements. Notifications require permission on this device. On iPhone, add WHDC to your Home Screen first.</p><p id="pushStatus" role="status" aria-live="polite">Checking notification support…</p><button type="button" class="btn" id="pushEnable">Enable notifications on this device</button><fieldset class="whdc-notification-prefs" style="margin-top:16px"><legend>Notification preferences</legend><label class="whdc-notification-choice"><input type="checkbox" id="pushNews"> What's New announcements</label><label class="whdc-notification-choice"><input type="checkbox" id="pushReminders"> Daily devotional reminders</label><label for="pushTime" class="whdc-reminder-label">Reminder time</label><input type="time" id="pushTime" value="08:00" class="whdc-reminder-time" style="font:inherit;min-height:44px"><p class="muted small whdc-reminder-days-title">Days to remind me:</p><div class="whdc-reminder-days">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i)=>`<label class="whdc-reminder-day"><input type="checkbox" name="pushDay" value="${i}" checked><span>${d}</span></label>`).join('')}</div></fieldset><div class="actions whdc-notification-actions" style="margin-top:12px"><button type="button" class="btn primary" id="pushSave">Save notification preferences</button><button type="button" class="btn" id="pushDisable">Turn off notifications on this device</button></div><p class="muted small">Settings are stored for this device. Reminders are sent on your selected days at your local time. Delivery may be delayed by your device or push provider.</p></section>`}
function wireNotificationSettings(){
 const el=id=>document.getElementById(id),status=el('pushStatus'),setStatus=t=>status.textContent=t;
 const supported=()=>('serviceWorker'in navigator&&'PushManager'in window&&'Notification'in window&&window.isSecureContext);
 const keyBytes=key=>{const base=key.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(base.padEnd(Math.ceil(base.length/4)*4,'=')),c=>c.charCodeAt(0))};
 const registration=()=>navigator.serviceWorker.ready;
 const subscription=async()=>supported()?await(await registration()).pushManager.getSubscription():null;
 const request=async(path,body)=>{const r=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify(body)});const data=await r.json().catch(()=>({}));if(!r.ok)throw Error(data.error||'Request failed');return data};
 const preferences=()=>({announcements_enabled:el('pushNews').checked,reminders_enabled:el('pushReminders').checked,reminder_local_time:el('pushTime').value,reminder_days:[...document.querySelectorAll('input[name="pushDay"]:checked')].map(x=>Number(x.value)),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone});
 const apply=stored=>{if(!stored)return;el('pushNews').checked=!!stored.announcements_enabled;el('pushReminders').checked=!!stored.reminders_enabled;el('pushTime').value=stored.reminder_local_time||'08:00';const days=stored.reminder_days||[];document.querySelectorAll('input[name="pushDay"]').forEach(x=>x.checked=days.includes(Number(x.value)))};
 const sync=async(sub)=>{const data=await request('/api/push/subscribe',{subscription:sub.toJSON(),preferences:preferences()});apply(data.preferences);return data};
 if(!supported()){setStatus('Push notifications are unavailable in this browser. On iPhone, install WHDC to your Home Screen and open it there.');el('pushEnable').disabled=true;el('pushSave').disabled=true;el('pushDisable').disabled=true;return}
 (async()=>{try{const sub=await subscription();if(!sub){setStatus('Notifications are not enabled on this device.');return}const r=await fetch('/api/push/preferences?endpoint='+encodeURIComponent(sub.endpoint),{cache:'no-store'});if(r.ok){const data=await r.json();apply(data.preferences)}setStatus('This device is subscribed. Notifications are enabled.')}catch(e){setStatus('Could not check subscription: '+e.message)}})();
 el('pushEnable').onclick=async()=>{try{if(Notification.permission==='denied')throw Error('Notification permission is blocked in device settings.');const permission=await Notification.requestPermission();if(permission!=='granted'){setStatus('Notification permission was not granted.');return}const key=await fetch('/api/push/public-key',{cache:'no-store'}).then(r=>r.json());if(!key.publicKey)throw Error('Public push key is not configured.');const reg=await registration();const sub=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(key.publicKey)});await sync(sub);setStatus('This device is subscribed. Notifications are enabled.')}catch(e){setStatus('Could not enable notifications: '+e.message)}};
 el('pushSave').onclick=async()=>{try{const sub=await subscription();if(!sub){setStatus('Enable notifications on this device before saving.');return}await sync(sub);setStatus('Notification preferences saved.')}catch(e){setStatus('Could not save preferences: '+e.message)}};
 el('pushDisable').onclick=async()=>{try{const sub=await subscription();if(sub){await request('/api/push/unsubscribe',{endpoint:sub.endpoint});await sub.unsubscribe()}setStatus('Notifications turned off on this device.')}catch(e){setStatus('Could not turn off notifications: '+e.message)}};
}
// Reading plans are public; progress and enrollment are kept only on this device.
const PLAN_ENROLL_KEY='whdc-reading-plans-enrolled-v1';
let customReadingPlans=[];
const planEnrollments=()=>load(PLAN_ENROLL_KEY,[]);
function planItems(){
 const byTitle=new Map(data.map(d=>[d.title.trim().toLowerCase(),d]));
 const existing=Object.entries(DEVOTIONAL_OUTLINE).map(([title,titles])=>{
  const ids=[...new Set(titles.map(t=>byTitle.get(String(t).trim().toLowerCase())?.id).filter(Boolean))];
  return {id:'series-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-'),title,description:'A devotional series to explore at your own pace.',devotional_ids:ids,source:'series'};
 }).filter(p=>p.devotional_ids.length);
 const custom=customReadingPlans.map(p=>({...p,devotional_ids:p.devotional_ids.filter(id=>data.some(d=>d.id===id)),source:'custom'})).filter(p=>p.devotional_ids.length);
 return [...existing,...custom];
}


const PLAN_FINISHED_KEY='whdc-reading-plan-completions-v1';
const planFinishedDates=()=>load(PLAN_FINISHED_KEY,{});
function syncPlanCompletions(){
 const finished=planFinishedDates();let changed=false;
 for(const p of planItems()){
  const complete=p.devotional_ids.length>0&&p.devotional_ids.every(id=>!!readDate(id));
  if(complete&&!finished[p.id]){finished[p.id]=new Date().toLocaleDateString('en-CA');changed=true}
  if(!complete&&finished[p.id]){delete finished[p.id];changed=true}
 }
 if(changed)localStorage.setItem(PLAN_FINISHED_KEY,JSON.stringify(finished));
 return finished;
}
function planCompletionMessage(p){
 const date=syncPlanCompletions()[p.id]||'';
 return `<section class="card" style="max-width:780px;margin:0 auto 20px;text-align:center" aria-label="Reading plan completed">
 <div class="eyebrow">Plan completed</div><h2>You've finished ${safe(p.title)}!</h2>
 <p><em>“He who began a good work in you will complete it until the day of Jesus Christ.”</em><br><small>Philippians 1:6 (WEB)</small></p>
 <p>Thank you for spending time reflecting on God's Word. You can return to these readings whenever you need them. Growth isn't measured by how quickly you finish.</p>
 ${date?`<p class="muted small">Completed ${safe(date)}</p>`:''}
 <div class="actions" style="justify-content:center"><button class="btn primary" id="completedPlansBack">Back to Reading Plans</button><button class="btn" id="completedPlanReview">Review this plan</button></div></section>`;
}
function readingMilestones(){
 const history=readHistory(),count=Object.keys(history).filter(id=>!!history[id]).length;
 const finished=syncPlanCompletions(),totalPlans=Object.keys(finished).length;
 const moments=[
  {reached:count>=1,title:'Your first devotional',detail:'One moment in Scripture matters.'},
  {reached:totalPlans>=1,title:'Your first completed plan',detail:'You made space for God’s Word, at your own pace.'},
  {reached:count>=25,title:'25 devotionals read',detail:'Every opportunity to return to Scripture is worthwhile.'}
 ];
 return `<section class="card"><h2>Reading Milestones</h2><p class="muted">Gentle reminders of time spent in God's Word, not goals you have to keep up with.</p><div class="grid">${moments.map(m=>`<div class="card"><h3>${m.reached?'✓ ':''}${safe(m.title)}</h3><p>${m.reached?safe(m.detail):'Still ahead, whenever you are ready.'}</p></div>`).join('')}</div></section>`;
}
function completedPlansLibrary(){
 const finished=syncPlanCompletions(),plans=planItems().filter(p=>finished[p.id]);
 return `<section class="card"><h2>Completed Plans</h2>${plans.length?`<div class="grid">${plans.map(p=>`<article class="card"><h3>${safe(p.title)}</h3><p class="muted small">Completed ${safe(finished[p.id])}</p><button class="btn" data-plan-open="${safe(p.id)}">Revisit plan</button></article>`).join('')}</div>`:'<p class="muted">Your completed reading plans will appear here.</p>'}</section>`;
}
function afterPlanReadingMarked(id){
 const planId=activeReadingPlan||selectedReadingPlan;
 const p=planItems().find(x=>x.id===planId&&x.devotional_ids.includes(id));
 const previously=!!syncPlanCompletions()[planId];
 toggleRead(id);
 const finished=syncPlanCompletions();
 if(p&&!previously&&finished[planId]){
  selectedReadingPlan=planId;activeReadingPlan='';view='plan-complete';history.pushState(null,'','#plan-complete');render();scrollTo(0,0);
 }else render();
}
function wirePlanCompletion(){
 document.getElementById('completedPlansBack')?.addEventListener('click',()=>nav('plans'));
 document.getElementById('completedPlanReview')?.addEventListener('click',()=>nav('plan-detail'));
}


// Private journal: local-only. No API calls or analytics. Export JSON to back up.
const JOURNAL_KEY='whdc-private-journal-v1';
const journalEntries=()=>{const entries=load(JOURNAL_KEY,[]);return Array.isArray(entries)?entries:[]};
const saveJournal=entries=>{localStorage.setItem(JOURNAL_KEY,JSON.stringify(entries));};
let journalFilter='all',journalSearch='',journalEditing='';
const journalId=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);

function journalEntryCard(e){
 const d=e.devotionalId&&data.find(x=>x.id===e.devotionalId);
 return `<article class="card"><div class="eyebrow">${safe(new Date(e.createdAt).toLocaleDateString())}</div><h3>${safe(e.title)}</h3><p style="white-space:pre-wrap;overflow-wrap:anywhere">${safe(e.text)}</p>${e.type==='prayer'?`<label style="display:flex;align-items:center;gap:8px;margin:12px 0;cursor:pointer"><input type="checkbox" data-journal-answered="${safe(e.id)}" ${e.answered?'checked':''} aria-label="Prayer answered: ${safe(e.title)}"> <span>Prayer answered</span></label>`:''}${d?`<p class="muted small">Devotional: ${safe(d.title)}</p>`:''}<div class="actions"><button type="button" class="btn" data-journal-edit="${safe(e.id)}">Edit</button><button type="button" class="btn" data-journal-delete="${safe(e.id)}">Delete</button>${d?`<button type="button" class="btn" data-journal-open="${safe(d.id)}">Open devotional</button>`:''}</div></article>`;
}
function devotionalJournalForm(d){
 const reflections=journalEntries().filter(e=>e.type==='reflection'&&e.devotionalId===d.id).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
 return `<div id="devotionalJournal" style="margin-top:16px">
 <form id="devotionalJournalForm"><h3 id="devotionalJournalHeading">Write a Reflection</h3>
 <input type="hidden" id="devotionalJournalTitle" value="${safe('Reflection on '+d.title)}">
 <label for="devotionalJournalText">Your reflection</label><textarea id="devotionalJournalText" required maxlength="30000" rows="6" placeholder="What stood out to you? What is God teaching you?" style="width:100%;box-sizing:border-box;padding:12px;margin:8px 0 14px"></textarea>
 <div class="actions whdc-reflection-actions" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="btn primary whdc-reflection-action" type="submit" aria-label="Save reflection" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:65px;min-height:57px;padding:7px 10px;line-height:1.15"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg><span style="font-size:12px;font-weight:600">Save</span></button><button class="btn  whdc-reflection-action" type="button" id="devotionalJournalClear" aria-label="New reflection" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:65px;min-height:57px;padding:7px 10px;line-height:1.15"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg><span style="font-size:12px;font-weight:600">New</span></button><button class="btn  whdc-reflection-action" type="button" id="devotionalJournalAll" aria-label="View reflection" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-width:65px;min-height:57px;padding:7px 10px;line-height:1.15"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span style="font-size:12px;font-weight:600">View</span></button></div><p role="status" id="devotionalJournalStatus"></p></form>
 <h3>Reflections for This Devotional</h3>${reflections.length?`<div class="grid">${reflections.map(journalEntryCard).join('')}</div>`:'<p class="muted">You have not written a reflection for this devotional yet.</p>'}</div>`;
}
function journalPage(){
 const entries=journalEntries().filter(e=>`${e.title} ${e.text}`.toLowerCase().includes(journalSearch.toLowerCase())).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
 const prayers=entries.filter(e=>e.type==='prayer'),reflections=entries.filter(e=>e.type==='reflection');
 return `<section class="hero"><div class="eyebrow">Private on this device</div><h1>My Journal</h1><p>Your prayer requests and devotional reflections, organized in one place. Your writing stays on this device unless you export it.</p></section>
 <section class="card" id="prayerRequestSection"><h2 id="journalEditorTitle">New Prayer Request</h2><p class="muted small">This form is for prayer requests. To write a devotional reflection, open the devotional and use its reflection journal.</p><form id="journalForm">
 <label for="journalTitle">Prayer request title</label><input id="journalTitle" maxlength="160" required placeholder="A prayer to remember" style="width:100%;box-sizing:border-box;padding:10px;margin:8px 0 14px">
 <label for="journalText">Prayer request</label><textarea id="journalText" required maxlength="30000" rows="6" placeholder="Write your prayer or request…" style="width:100%;box-sizing:border-box;margin:8px 0 14px;padding:12px"></textarea>
 <label style="display:block;margin-bottom:14px"><input type="checkbox" id="journalAnswered"> Prayer answered</label>
 <div class="actions"><button type="submit" class="btn primary">Save Prayer Request</button><button type="button" class="btn" id="journalClear">New Prayer Request</button></div><p id="journalStatus" role="status" aria-live="polite"></p></form></section>
 <section class="card"><h2>My Journal Entries</h2><div class="actions"><label for="journalSearch">Search entries <input id="journalSearch" type="search" placeholder="Search prayers and reflections" value="${safe(journalSearch)}"></label><button type="button" class="btn" id="journalExport">Export My Journal</button></div>
 <p class="muted small">Your export includes both prayer requests and devotional reflections. Keep your backup somewhere private. Clearing this app's storage can erase entries.</p>
 <section id="journalPrayers"><h3>Prayer Requests (${prayers.length})</h3>${prayers.length?`<div class="grid">${prayers.map(journalEntryCard).join('')}</div>`:'<p class="muted">No prayer requests found.</p>'}</section>
 <section id="journalReflections"><h3>Devotional Reflections (${reflections.length})</h3>${reflections.length?`<div class="grid">${reflections.map(journalEntryCard).join('')}</div>`:'<p class="muted">No devotional reflections found. Open a devotional to write one.</p>'}</section></section>`;
}
function journalExport(){
 const blob=new Blob([JSON.stringify({format:'whdc-journal',version:1,exportedAt:new Date().toISOString(),entries:journalEntries()},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='WHDC-private-journal-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function wireJournalEntryActions(){
 document.querySelectorAll('[data-journal-answered]').forEach(box=>box.onchange=()=>{
  const entries=journalEntries(),entry=entries.find(e=>e.id===box.dataset.journalAnswered&&e.type==='prayer');
  if(!entry)return;
  const previous=!!entry.answered;
  entry.answered=box.checked;entry.updatedAt=new Date().toISOString();
  try{saveJournal(entries)}catch(err){entry.answered=previous;box.checked=previous;alert('Unable to save this change. Please try again.')}
 });
 document.querySelectorAll('[data-journal-delete]').forEach(b=>b.onclick=()=>{
  if(!confirm('Permanently delete this journal entry from this device?'))return;
  try{saveJournal(journalEntries().filter(e=>e.id!==b.dataset.journalDelete));render()}catch(e){alert('Could not delete the entry. Please try again.')}
 });
 document.querySelectorAll('[data-journal-open]').forEach(b=>b.onclick=()=>{
  activeReadingPlan='';currentId=b.dataset.journalOpen;view='today';rememberOpenDevotional(currentId);render();scrollTo(0,0);
 });
 document.querySelectorAll('[data-journal-edit]').forEach(b=>b.onclick=()=>{
  const e=journalEntries().find(x=>x.id===b.dataset.journalEdit);if(!e)return;
  if(e.type==='reflection'){
   const d=data.find(x=>x.id===e.devotionalId);
   if(!d){alert('The devotional associated with this reflection is no longer available.');return}
   activeReadingPlan='';currentId=d.id;view='today';rememberOpenDevotional(currentId);render();
   const form=document.getElementById('devotionalJournalForm');if(!form)return;
   revealDevotionalReflection();
   devotionalJournalEditing=e.id;
   document.getElementById('devotionalJournalTitle').value=e.title;
   document.getElementById('devotionalJournalText').value=e.text;
   document.getElementById('devotionalJournalHeading').textContent='Edit Reflection';
   form.scrollIntoView({behavior:'smooth'});
  }else{
   if(view!=='journal'){view='journal';render()}
   journalEditing=e.id;
   document.getElementById('journalTitle').value=e.title;
   document.getElementById('journalText').value=e.text;
   document.getElementById('journalAnswered').checked=!!e.answered;
   document.getElementById('journalEditorTitle').textContent='Edit Prayer Request';
   document.getElementById('journalForm').scrollIntoView({behavior:'smooth'});
  }
 });
}
let devotionalJournalEditing='';
function wireDevotionalJournal(){
 const form=document.getElementById('devotionalJournalForm');if(!form)return;
 const d=current();if(!d)return;
 const title=document.getElementById('devotionalJournalTitle'),body=document.getElementById('devotionalJournalText');
 const reset=()=>{devotionalJournalEditing='';form.reset();title.value='Reflection on '+d.title;document.getElementById('devotionalJournalHeading').textContent='Write a Reflection'};
 document.getElementById('devotionalJournalClear').onclick=reset;
 document.getElementById('devotionalJournalAll').onclick=()=>nav('journal');
 form.onsubmit=e=>{
  e.preventDefault();const entries=journalEntries(),now=new Date().toISOString();
  const entry={id:devotionalJournalEditing||journalId(),type:'reflection',title:'Reflection on '+d.title,text:body.value.trim(),devotionalId:d.id,answered:false,createdAt:now,updatedAt:now};
  if(!entry.title||!entry.text)return;
  const i=entries.findIndex(x=>x.id===entry.id);
  if(i>=0){entry.createdAt=entries[i].createdAt;entries[i]=entry}else entries.push(entry);
  try{saveJournal(entries);devotionalJournalEditing='';render();revealDevotionalReflection();document.getElementById('devotionalJournal')?.scrollIntoView({behavior:'smooth'})}
  catch{document.getElementById('devotionalJournalStatus').textContent='Unable to save. Device storage may be full.'}
 };
}
function wireJournal(){
 const form=document.getElementById('journalForm');
 if(form){
  const title=document.getElementById('journalTitle'),body=document.getElementById('journalText'),answered=document.getElementById('journalAnswered');
  document.getElementById('journalSearch').onchange=e=>{journalSearch=e.target.value;render()};
  document.getElementById('journalClear').onclick=()=>{journalEditing='';form.reset();document.getElementById('journalEditorTitle').textContent='New Prayer Request'};
  form.onsubmit=e=>{
   e.preventDefault();const entries=journalEntries(),now=new Date().toISOString();
   const entry={id:journalEditing||journalId(),type:'prayer',title:title.value.trim(),text:body.value.trim(),devotionalId:'',answered:answered.checked,createdAt:now,updatedAt:now};
   if(!entry.title||!entry.text)return;
   const i=entries.findIndex(x=>x.id===entry.id);
   if(i>=0){entry.createdAt=entries[i].createdAt;entries[i]=entry}else entries.push(entry);
   try{saveJournal(entries);journalEditing='';render()}
   catch{document.getElementById('journalStatus').textContent='Unable to save. Device storage may be full.'}
  };
  document.getElementById('journalExport').onclick=journalExport;
 }
 wireDevotionalJournal();
 wireJournalEntryActions();
}
function revealDevotionalReflection(){
 const section=document.getElementById('reflectionText');
 const toggle=document.getElementById('reflectionToggle');
 if(section){section.classList.remove('hidden');if(toggle){toggle.setAttribute('aria-expanded','true');toggle.textContent='Close ↑'}}
}
function startDevotionalReflection(){
 revealDevotionalReflection();
 document.getElementById('devotionalJournal')?.scrollIntoView({behavior:'smooth',block:'start'});
 document.getElementById('devotionalJournalText')?.focus({preventScroll:true});
}

// Favorite verses and memory practice: private, local to this browser.
const FAVORITE_VERSES_KEY='whdc-favorite-verses-v1';
const favoriteVerses=()=>{const v=load(FAVORITE_VERSES_KEY,[]);return Array.isArray(v)?v:[]};
const writeFavoriteVerses=v=>localStorage.setItem(FAVORITE_VERSES_KEY,JSON.stringify(v));
let favoriteVerseSearch='',favoriteVersePractice='',favoriteVerseHide=1,favoriteVerseReveal=false;
function favoriteVerseId(ref){return String(ref).trim().replace(/\s+/g,' ').toLowerCase()}
function addFavoriteVerse(reference,text,source=''){
 const ref=String(reference||'').trim(),verse=String(text||'').trim();
 if(!ref||!verse)return false;
 const list=favoriteVerses(),id=favoriteVerseId(ref),old=list.find(v=>v.id===id);
 if(old){old.text=verse;old.source=source||old.source||''}else list.push({id,reference:ref,text:verse,source,createdAt:new Date().toISOString()});
 writeFavoriteVerses(list);return true;
}
function favoriteVersePracticeHtml(){
 const v=favoriteVerses().find(x=>x.id===favoriteVersePractice);if(!v)return '';
 const tokens=(Array.isArray(v.paragraphs)&&v.paragraphs.length?v.paragraphs.join(' \n '):v.text).split(/(\s+)/);
 const words=tokens.filter(t=>t.trim());
 let index=0;
 const output=tokens.map(t=>{if(!t.trim())return t.includes('\n')?'<br><br>':' ';const n=index++;const visible=favoriteVerseReveal||favoriteVerseHide===0||(favoriteVerseHide===1?n%3!==1:n%4===0);return visible?safe(t):'<span aria-label="hidden word" style="display:inline-block;border-bottom:1px solid currentColor;min-width:3em">&nbsp;</span>'}).join('');
 return `<section class="card" id="versePractice"><h2>Scripture Memory Practice</h2><p class="muted">Practice at your own pace. No scores or deadlines.</p><h3>${safe(v.reference)}</h3><p style="font-size:1.15rem;line-height:2">${output}</p><div class="actions"><label>Practice level <select id="favoritePracticeLevel"><option value="0" ${favoriteVerseHide===0?'selected':''}>Show all</option><option value="1" ${favoriteVerseHide===1?'selected':''}>Some hidden</option><option value="2" ${favoriteVerseHide===2?'selected':''}>Most hidden</option></select></label><button type="button" class="btn" id="favoritePracticeReveal">${favoriteVerseReveal?'Hide answer':'Reveal verse'}</button><button type="button" class="btn" id="favoritePracticeClose">Close practice</button></div></section>`;
}
function favoriteVersesPage(){
 const all=favoriteVerses(),filtered=all.filter(v=>(v.reference+' '+v.text).toLowerCase().includes(favoriteVerseSearch.toLowerCase()));
 return `<section class="hero"><div class="eyebrow">Scripture to keep close</div><h1>My Favorite Verses</h1><p>Save passages that encourage you, revisit them, and practice remembering them. Your verses stay on this device.</p></section>
 <section class="card"><h2>Save verses from the Bible Reader</h2><p>Open the Bible Reader, select a verse or drag across a passage, then choose <strong>Save to My Favorite Verses</strong>. The paragraph breaks will be kept.</p><a class="btn primary" href="/bible-reader.html">Open Bible Reader</a></section>
 ${favoriteVersePracticeHtml()}
 <section class="card"><h2>Saved Verses (${all.length})</h2><div class="actions"><label for="favoriteVerseSearch">Search <input id="favoriteVerseSearch" type="search" value="${safe(favoriteVerseSearch)}" placeholder="Search verses"></label><button class="btn" id="favoriteVerseExport" type="button">Export My Favorite Verses</button></div>
 <div class="grid">${filtered.map(v=>`<article class="card"><h3>${safe(v.reference)}</h3><div class="favorite-passage" style="line-height:1.85">${(Array.isArray(v.paragraphs)&&v.paragraphs.length?v.paragraphs:[v.text]).map(p=>`<p style="margin:.7em 0;white-space:pre-wrap">${safe(p)}</p>`).join('')}</div><div class="actions"><button class="btn" data-verse-practice="${safe(v.id)}">Practice</button><button class="btn" data-verse-remove="${safe(v.id)}">Remove</button></div></article>`).join('')||'<p>No verses found. Save a verse to begin your collection.</p>'}</div></section>`;
}
function wireFavoriteVerses(){
 if(!document.getElementById('favoriteVerseSearch'))return;
 document.getElementById('favoriteVerseSearch').onchange=e=>{favoriteVerseSearch=e.target.value;render()};
 document.querySelectorAll('[data-verse-practice]').forEach(b=>b.onclick=()=>{favoriteVersePractice=b.dataset.versePractice;favoriteVerseHide=1;favoriteVerseReveal=false;render();document.getElementById('versePractice')?.scrollIntoView({behavior:'smooth'})});
 document.querySelectorAll('[data-verse-remove]').forEach(b=>b.onclick=()=>{if(!confirm('Remove this verse from My Favorite Verses?'))return;writeFavoriteVerses(favoriteVerses().filter(v=>v.id!==b.dataset.verseRemove));if(favoriteVersePractice===b.dataset.verseRemove)favoriteVersePractice='';render()});
 document.getElementById('favoritePracticeLevel')?.addEventListener('change',e=>{favoriteVerseHide=Number(e.target.value);favoriteVerseReveal=false;render();document.getElementById('versePractice')?.scrollIntoView()});
 document.getElementById('favoritePracticeReveal')?.addEventListener('click',()=>{favoriteVerseReveal=!favoriteVerseReveal;render();document.getElementById('versePractice')?.scrollIntoView()});
 document.getElementById('favoritePracticeClose')?.addEventListener('click',()=>{favoriteVersePractice='';render()});
 document.getElementById('favoriteVerseExport').onclick=()=>{const blob=new Blob([JSON.stringify({format:'whdc-favorite-verses',version:1,exportedAt:new Date().toISOString(),verses:favoriteVerses()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='WHDC-favorite-verses-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)};
}


// Inductive Bible Study guide and private study annotation management.
const STUDY_MARK_KEYS={bible:'whdc-bible-annotations-v1',devotional:'whdc-devotional-annotations-v1'};
function studyGuidePage(){
 const categories=[['#ffe06b','God','God’s character, attributes, and actions'],['#f38bb7','Love','God’s love, grace, mercy, compassion, and kindness'],['#65c9f5','Promises','What God says He will do'],['#9ed88d','Instruction','Wisdom, teaching, guidance, and principles for growth'],['#ffb16a','Commands','What God asks us to do and obedience'],['#a67ae6','Prayer','Prayer, worship, and praise'],['#ff7381','Jesus','Jesus, salvation, the Gospel, and His work'],['#b7855e','Warnings','Sin, warnings, consequences, judgment, and what to avoid'],['#66d3d2','People','People, places, important events, names, and timelines'],['#c7a4f4','Other','Anything else meaningful or worth remembering'],['#f2d86f','Holy Spirit','The Spirit’s character, attributes, and actions']];
 return `<section class="hero"><div class="eyebrow">Read, notice, reflect</div><h1>Inductive Bible Study</h1><p>A simple way to slow down and let Scripture speak for itself. The study tools help you notice what you read, remember what stands out, and return to it later.</p><div class="actions"><a class="btn primary" href="/bible-reader.html">Open Bible Reader →</a></div></section>
 <details class="card whdc-study-guide-section" style="padding:0;overflow:hidden"><summary style="cursor:pointer;display:list-item;list-style-position:inside;padding:18px 20px;font-weight:700;font-size:1.15rem">What is inductive Bible study?</summary><div style="padding:0 20px 20px"><p>Inductive study begins with the passage itself, rather than starting with a conclusion. Read in context and ask three questions:</p><h3>1. Observation: What does the passage say?</h3><p>Notice repeated words, descriptions of God, people, commands, promises, contrasts, and connections. Read the surrounding verses to understand who is speaking and to whom.</p><h3>2. Interpretation: What does the passage mean?</h3><p>Consider the author’s purpose, the original audience, and the larger context of the chapter and book. Let Scripture help explain Scripture. A highlighted phrase is a starting point for careful reading, not a substitute for context.</p><h3>3. Application: How should I respond?</h3><p>Ask what this reveals about God, what you are called to believe or obey, and how you can respond in prayer. Application grows from understanding the passage accurately.</p></div></details>
 <details class="card whdc-study-guide-section" style="padding:0;overflow:hidden"><summary style="cursor:pointer;display:list-item;list-style-position:inside;padding:18px 20px;font-weight:700;font-size:1.15rem">How to use the study tools</summary><div style="padding:0 20px 20px"><ol><li>Open the <a href="/bible-reader.html">Bible Reader</a> and select a passage.</li><li>On a phone, touch and hold a word, then adjust the selection handles. On a computer, click and drag across the text.</li><li>Tap <strong>✎ Study</strong> to open the floating toolbar. Choose <strong>Highlight</strong>, <strong>Circle</strong>, or <strong>Underline</strong>.</li><li>For Highlight, choose a theme color below. Only the text you selected is marked.</li><li>Use <strong>♡ Save to Favorites</strong> to save a complete verse or passage. Favorites preserve paragraph breaks even when you select only a few words.</li><li>Your study markings are stored on this device so you can return to them later. In devotionals, selecting text offers Save Quote instead.</li></ol><p class="muted small">Tip: Circle repeated or important words, underline commands or key phrases, and use colors to organize themes. These are suggestions, not rules.</p></div></details>
 <details class="card whdc-study-guide-section" style="padding:0;overflow:hidden"><summary style="cursor:pointer;display:list-item;list-style-position:inside;padding:18px 20px;font-weight:700;font-size:1.15rem">Highlight color guide</summary><div style="padding:0 20px 20px"><p>Use these themes as a starting point. You can adapt them to the way you study.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">${categories.map(([color,name,desc])=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:10px;border:1px solid var(--line,#ddd);border-radius:10px"><span aria-hidden="true" style="display:block;flex:0 0 38px;height:21px;border-radius:8px;background:${color}"></span><div><strong>${name}</strong><div class="muted small">${desc}</div></div></div>`).join('')}</div><p class="muted small">God, Jesus, and Holy Spirit each have a category so you can mark their character, attributes, and actions separately.</p></div></details>
 <details class="card whdc-study-guide-section" style="padding:0;overflow:hidden"><summary style="cursor:pointer;display:list-item;list-style-position:inside;padding:18px 20px;font-weight:700;font-size:1.15rem">Manage Study Notes</summary><div style="padding:0 20px 20px"><p>Study highlights, circles, underlines, and paragraph notes are stored privately in this browser. Export a backup before clearing your browser data or changing devices.</p><div class="actions"><button class="btn primary" type="button" id="exportStudyNotes">Export Study Notes (JSON)</button></div><p class="muted small">The export includes Bible Reader and devotional study markings. It also includes paragraph notes. It does not include your Favorite Verses, Saved Quotes, or journal entries, which have their own exports.</p><h3>Clear saved markings</h3><p>These actions cannot be undone. Export first if you want to keep a copy.</p><div class="actions"><button class="btn" type="button" id="clearBibleStudyNotes">Clear Bible Reader Markings</button></div><div class="actions"><button class="btn" type="button" id="clearParagraphNotes">Clear Paragraph Notes</button></div><p id="studyNotesStatus" role="status" class="muted small"></p></div></details>`;
}
function wireStudyGuide(){
 if(!document.getElementById('exportStudyNotes'))return;
 const status=document.getElementById('studyNotesStatus');
 document.getElementById('exportStudyNotes').onclick=()=>{
  const data={format:'whdc-inductive-study-notes',version:1,exportedAt:new Date().toISOString(),bibleAnnotations:null,devotionalAnnotations:null,paragraphNotes:null};
  try{data.bibleAnnotations=JSON.parse(localStorage.getItem(STUDY_MARK_KEYS.bible)||'{}');data.devotionalAnnotations=JSON.parse(localStorage.getItem(STUDY_MARK_KEYS.devotional)||'{}');data.paragraphNotes=JSON.parse(localStorage.getItem('whdc-inductive-paragraph-notes-v1')||'{}')}catch{status.textContent='Could not read saved notes. Nothing was exported.';return}
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='WHDC-study-notes-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);status.textContent='Study notes backup prepared for download.';
 };
 document.getElementById('clearParagraphNotes').onclick=()=>{if(!confirm('Permanently delete all Bible and devotional paragraph notes on this device? Export a backup first.'))return;localStorage.removeItem('whdc-inductive-paragraph-notes-v1');status.textContent='Paragraph notes cleared. Reload the reader to update note icons.'};
 for(const [id,kind,label] of [['clearBibleStudyNotes','bible','Bible Reader']]){
  document.getElementById(id).onclick=()=>{if(!confirm('Permanently clear all '+label+' study highlights, circles, and underlines on this device? This cannot be undone. Favorite Verses and Saved Quotes will remain.'))return;
   try{localStorage.removeItem(STUDY_MARK_KEYS[kind]);status.textContent=label+' study markings cleared. Open or reload the reader to see the change.'}catch{status.textContent='Unable to clear notes on this device.'}
  };
 }
}

// Saved Quotes: selections from devotional prose only, attributed to its author.
const SAVED_QUOTES_KEY='whdc-saved-quotes-v1';
const savedQuotes=()=>{const q=load(SAVED_QUOTES_KEY,[]);return Array.isArray(q)?q:[]};
const saveQuotes=q=>localStorage.setItem(SAVED_QUOTES_KEY,JSON.stringify(q));
let quotesSearch='',quoteSelectionTimer=0;
let quoteSelectionAbort=new AbortController();
function savedQuotesPage(){
 const all=savedQuotes().slice().sort((a,b)=>String(b.savedAt).localeCompare(String(a.savedAt)));
 const filtered=all.filter(q=>[q.text,q.author,q.devotionalTitle].join(' ').toLowerCase().includes(quotesSearch.toLowerCase()));
 return `<section class="hero"><div class="eyebrow">Words to return to</div><h1>Saved Quotes</h1><p>Highlight a meaningful passage while reading a devotional and tap ♡ Save Quote. Each quote includes its devotional author.</p></section>
 <section class="card"><div class="actions"><label for="savedQuotesSearch">Search quotes <input type="search" id="savedQuotesSearch" value="${safe(quotesSearch)}" placeholder="Search words, author or devotional"></label><button type="button" class="btn" id="exportSavedQuotes">Export Saved Quotes</button></div>
 <p class="muted small">Saved privately on this device. Export a backup before clearing browser data.</p>
 <div class="grid">${filtered.map(q=>`<article class="card"><blockquote style="white-space:pre-wrap;overflow-wrap:anywhere;margin:0 0 12px">“${safe(q.text)}”</blockquote><p class="muted small">— ${safe(q.author)} · ${safe(q.devotionalTitle)}</p><div class="actions"><button type="button" class="btn" data-quote-open="${safe(q.devotionalId)}">Read devotional</button><button type="button" class="btn" data-quote-delete="${safe(q.id)}">Remove</button></div></article>`).join('')||'<p>No quotes found yet. Open a devotional and highlight text to save a quote.</p>'}</div></section>`;
}
function wireSavedQuotes(){
 const search=document.getElementById('savedQuotesSearch');if(!search)return;
 search.onchange=e=>{quotesSearch=e.target.value;render()};
 document.querySelectorAll('[data-quote-delete]').forEach(b=>b.onclick=()=>{
  if(!confirm('Remove this saved quote?'))return;
  saveQuotes(savedQuotes().filter(q=>q.id!==b.dataset.quoteDelete));render();
 });
 document.querySelectorAll('[data-quote-open]').forEach(b=>b.onclick=()=>{
  const d=data.find(x=>x.id===b.dataset.quoteOpen);if(!d)return;
  activeReadingPlan='';currentId=d.id;view='today';rememberOpenDevotional(currentId);render();scrollTo(0,0);
 });
 document.getElementById('exportSavedQuotes').onclick=()=>{
  const blob=new Blob([JSON.stringify({format:'whdc-saved-quotes',version:1,exportedAt:new Date().toISOString(),quotes:savedQuotes()},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='WHDC-saved-quotes-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 };
}
function wireDevotionalQuoteSelection(){
 quoteSelectionAbort.abort();quoteSelectionAbort=new AbortController();
 if(view!=='today')return;
 const d=current(),container=document.getElementById('quoteSelectableDevotional');if(!d||!container)return;
 let btn=document.getElementById('saveQuoteSelection');
 if(!btn){btn=document.createElement('button');btn.id='saveQuoteSelection';btn.type='button';btn.setAttribute('aria-label','Save highlighted devotional quote');btn.textContent='♡ Save Quote';document.body.append(btn)}
 const styleId='whdc-quote-selection-style';
 if(!document.getElementById(styleId)){
  const st=document.createElement('style');st.id=styleId;
  st.textContent='#saveQuoteSelection{position:fixed;left:0;top:0;bottom:auto;transform:none;z-index:2147483000;padding:7px 12px;min-height:36px;border:1px solid #a59b89;border-radius:999px;background:#f7f5f0;color:#393f4a;box-shadow:0 3px 14px #0004;font:600 13px/1.25 system-ui,sans-serif;white-space:nowrap;cursor:pointer;touch-action:manipulation}#saveQuoteSelection[hidden]{display:none!important}#quoteSelectableDevotional,#quoteSelectableDevotional .whdc-quote-text,#quoteSelectableDevotional .whdc-quote-text *{user-select:text;-webkit-user-select:text;-webkit-touch-callout:default}';document.head.append(st)
 }
 btn.hidden=true;
 let chosen='',lastRect=null;
 const update=()=>{
  if(view!=='today'||!container.isConnected){btn.hidden=true;return}
  const sel=window.getSelection();
  if(!sel||sel.isCollapsed||!sel.rangeCount){if(!chosen)btn.hidden=true;return}
  const range=sel.getRangeAt(0);
  const readable=[...container.querySelectorAll('.whdc-quote-text')];
  const eligible=readable.some(el=>{try{return range.intersectsNode(el)}catch{return false}});
  if(!eligible){btn.hidden=true;chosen='';return}
  const text=sel.toString().replace(/\s+/g,' ').trim();
  if(text.length<2)return;
  chosen=text;btn.textContent='♡ Save Quote';
  const rects=[...range.getClientRects()].filter(r=>r.width&&r.height);
  const rect=rects[rects.length-1]||range.getBoundingClientRect();
  if(rect&&Number.isFinite(rect.left)&&Number.isFinite(rect.bottom))lastRect={left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom};
  btn.hidden=false;
  const vw=document.documentElement.clientWidth,vh=window.innerHeight;
  const bw=btn.offsetWidth||110,bh=btn.offsetHeight||36;
  const r=lastRect||{left:vw/2,right:vw/2,top:vh/2,bottom:vh/2};
  const x=Math.max(8,Math.min(vw-bw-8,(r.left+r.right-bw)/2));
  const y=r.top>=bh+14?r.top-bh-9:Math.min(vh-bh-8,r.bottom+9);
  btn.style.left=Math.round(x)+'px';btn.style.top=Math.round(Math.max(8,y))+'px';
 };
 const schedule=(delay=180)=>{clearTimeout(quoteSelectionTimer);quoteSelectionTimer=setTimeout(update,delay)};
 // Mobile browsers finalize selection handles after touchend, often with a delay.
 container.addEventListener('touchend',()=>{schedule(250);setTimeout(update,500)},{passive:true,signal:quoteSelectionAbort.signal});
 container.addEventListener('pointerup',()=>schedule(120),{signal:quoteSelectionAbort.signal});
 container.addEventListener('mouseup',()=>schedule(80),{signal:quoteSelectionAbort.signal});
 container.addEventListener('keyup',()=>schedule(80),{signal:quoteSelectionAbort.signal});
 document.addEventListener('selectionchange',()=>schedule(220),{signal:quoteSelectionAbort.signal});
 // Prevent tapping the floating button from collapsing the selection before saving.
 btn.addEventListener('pointerdown',e=>e.preventDefault(),{signal:quoteSelectionAbort.signal});
 btn.addEventListener('touchstart',e=>e.preventDefault(),{passive:false,signal:quoteSelectionAbort.signal});
 btn.onclick=()=>{
  if(!chosen)return;
  const list=savedQuotes(),author=String(d.author||'Heather Kusunoki'),id='quote-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
  try{list.push({id,text:chosen,author,devotionalId:d.id,devotionalTitle:d.title,savedAt:new Date().toISOString()});saveQuotes(list);btn.textContent='♥ Quote Saved';window.getSelection()?.removeAllRanges();chosen='';setTimeout(()=>{btn.hidden=true},1200)}
  catch{btn.textContent='Unable to save quote'}
 };
}

function myReadingPlans(){
 const enrolled=planEnrollments(),plans=planItems().filter(p=>enrolled.includes(p.id));
 if(!plans.length)return `<section class="card"><h2>My Reading Plans</h2><p>You haven't started a plan yet. Explore the plans below and start whenever you're ready.</p></section>`;
 return `<section class="card"><h2>My Reading Plans</h2><p class="muted">Pick up where you left off. No deadlines and no pressure.</p><div class="grid">${plans.map(p=>{
 const total=p.devotional_ids.length,done=p.devotional_ids.filter(id=>readDate(id)).length;
 const next=p.devotional_ids.find(id=>!readDate(id));
 return `<article class="card"><h3>${safe(p.title)}</h3><p>${done} of ${total} completed${done===total?' · Plan complete!':''}</p><progress max="${total}" value="${done}" style="width:100%;height:14px" aria-label="${safe(p.title)} progress"></progress><div class="actions" style="margin-top:12px"><button class="btn primary" data-plan-continue="${safe(p.id)}">${next?'Continue reading':'Review plan'}</button><button class="btn" data-plan-open="${safe(p.id)}">View readings</button></div></article>`;
 }).join('')}</div></section>`;
}
function planOverview(){
 const enrolled=planEnrollments();
 return `<section class="hero"><div class="eyebrow">Read at your own pace</div><h1>Reading Plans</h1><p>Follow a series or choose a guided plan. There are no deadlines, streaks, or missed days to make up.</p></section>${myReadingPlans()}${completedPlansLibrary()}<h2>Explore Reading Plans</h2><div class="grid">${planItems().map(p=>{
 const done=p.devotional_ids.filter(id=>readDate(id)).length,total=p.devotional_ids.length;
 return `<article class="card"><div class="eyebrow">${p.source==='custom'?'Guided plan':'Devotional series'}</div><h2>${safe(p.title)}</h2><p>${safe(p.description||'')}</p><p class="muted small">${done} of ${total} read</p><progress max="${total}" value="${done}" style="width:100%;height:14px" aria-label="${safe(p.title)} reading progress"></progress><div class="actions" style="margin-top:14px"><button class="btn primary" data-plan-open="${safe(p.id)}">${enrolled.includes(p.id)?'View plan':'View plan'}</button></div></article>`;
 }).join('')||'<p>Reading plans will appear as devotionals are published.</p>'}</div><p class="muted small">Your progress stays on this device. Clearing browser data can erase it.</p>`;
}
function planReaderNavigation(){
 if(!activeReadingPlan)return '';
 const p=planItems().find(x=>x.id===activeReadingPlan);
 if(!p||!p.devotional_ids.includes(currentId)){activeReadingPlan='';return ''}
 const index=p.devotional_ids.indexOf(currentId),hasNext=index<p.devotional_ids.length-1;
 return `<nav class="card" aria-label="Reading plan navigation" style="margin-bottom:16px;padding:14px 18px"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:10px"><strong>${safe(p.title)}</strong><span class="muted small">Reading ${index+1} of ${p.devotional_ids.length}</span></div><div class="actions" style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="returnToReadingPlan" type="button">← Back to Plan</button>${hasNext?'<button class="btn primary" id="nextPlanReading" type="button">Next Reading →</button>':''}</div></nav>`;
}
function planReaderFooter(){
 if(!activeReadingPlan)return '';
 const p=planItems().find(x=>x.id===activeReadingPlan);
 if(!p||!p.devotional_ids.includes(currentId))return '';
 const i=p.devotional_ids.indexOf(currentId),hasNext=i<p.devotional_ids.length-1;
 return `<nav class="card" aria-label="End of reading plan navigation" style="margin-top:20px;padding:18px"><p class="muted small" style="margin:0 0 10px">${safe(p.title)} · Reading ${i+1} of ${p.devotional_ids.length}</p><div class="actions" style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" type="button" data-plan-return>← Back to Plan</button>${hasNext?'<button class="btn primary" type="button" data-plan-next>Next Reading →</button>':'<button class="btn primary" type="button" data-plan-return>Review Completed Plan →</button>'}</div></nav>`;
}
function openFromReadingPlan(id,planId){
 if(!planItems().some(p=>p.id===planId&&p.devotional_ids.includes(id)))return;
 activeReadingPlan=planId;selectedReadingPlan=planId;currentId=id;scriptureOpen=false;scriptureForId=null;view='today';rememberOpenDevotional(id);render();scrollTo(0,0);
}

// Automatic read tracking is restricted to devotionals opened from a reading plan.
// The reader must keep the end-of-devotional marker in view for one second.
let planReadObserver=null,planReadTimer=null;
const planManualUnreadThisSession=new Set();
function stopPlanAutoRead(){
 if(planReadObserver){planReadObserver.disconnect();planReadObserver=null}
 if(planReadTimer!==null){clearTimeout(planReadTimer);planReadTimer=null}
}
function wirePlanAutoRead(){
 stopPlanAutoRead();
 if(view!=='today'||!activeReadingPlan)return;
 const devotional=current(),plan=planItems().find(p=>p.id===activeReadingPlan);
 if(!devotional||!plan||!plan.devotional_ids.includes(devotional.id))return;
 const marker=document.getElementById('readingPlanAutoReadEnd');
 if(!marker||!('IntersectionObserver' in window))return;
 const planId=activeReadingPlan,devotionalId=devotional.id,sessionKey=planId+'::'+devotionalId;
 if(readDate(devotionalId)||planManualUnreadThisSession.has(sessionKey))return;
 planReadObserver=new IntersectionObserver(entries=>{
  const visible=entries.some(e=>e.isIntersecting);
  if(!visible){if(planReadTimer!==null){clearTimeout(planReadTimer);planReadTimer=null}return}
  if(planReadTimer!==null)return;
  planReadTimer=setTimeout(()=>{
   planReadTimer=null;
   if(view!=='today'||activeReadingPlan!==planId||currentId!==devotionalId||readDate(devotionalId)||planManualUnreadThisSession.has(sessionKey))return;
   if(!marker.isConnected||!marker.getBoundingClientRect||!marker.getClientRects().length)return;
   const rect=marker.getBoundingClientRect();
   if(rect.bottom<0||rect.top>window.innerHeight)return;
   const reads=readHistory();reads[devotionalId]=new Date().toLocaleDateString('en-CA');
   try{localStorage.setItem(READ_KEY,JSON.stringify(reads));syncPlanCompletions()}catch{return}
   stopPlanAutoRead();
   // Update the button without navigating away from the devotional.
   const button=document.getElementById('markRead');
   if(button){button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Mark as unread');button.title='Mark as unread';const symbol=button.querySelector('span');if(symbol)symbol.textContent='☑'}
  },1000);
 },{threshold:0});
 planReadObserver.observe(marker);
}

function wirePlanReaderNavigation(){
 document.querySelectorAll('#returnToReadingPlan,[data-plan-return]').forEach(b=>b.addEventListener('click',()=>{selectedReadingPlan=activeReadingPlan;activeReadingPlan='';nav('plan-detail')}));
 document.querySelectorAll('#nextPlanReading,[data-plan-next]').forEach(b=>b.addEventListener('click',()=>{
  const p=planItems().find(x=>x.id===activeReadingPlan);if(!p)return;
  const i=p.devotional_ids.indexOf(currentId);if(i<0||i+1>=p.devotional_ids.length)return;
  openFromReadingPlan(p.devotional_ids[i+1],p.id);
 }));
}

function planDetail(){
 const p=planItems().find(x=>x.id===selectedReadingPlan);
 if(!p)return planOverview();
 const done=p.devotional_ids.filter(id=>readDate(id)).length,joined=planEnrollments().includes(p.id);
 const next=p.devotional_ids.find(id=>!readDate(id))||p.devotional_ids[0];
 return `<section class="hero"><div class="eyebrow">Reading plan</div><h1>${safe(p.title)}</h1><p>${safe(p.description||'')}</p><p>${done} of ${p.devotional_ids.length} devotionals completed</p><progress max="${p.devotional_ids.length}" value="${done}" style="width:100%;max-width:500px;height:16px" aria-label="Plan progress"></progress><div class="actions"><button class="btn primary" id="planStart">${joined?'Continue reading':'Start this plan'}</button>${joined?'<button class="btn" id="planLeave">Remove from my plans</button>':''}<button class="btn" id="planBack">← Back to Reading Plans</button></div></section><div class="grid">${p.devotional_ids.map((id,i)=>{const d=data.find(x=>x.id===id);return d?`<article class="card"><div class="eyebrow">Reading ${i+1} of ${p.devotional_ids.length}</div><h3>${safe(d.title)}</h3>${readBadge(id)}<div class="actions"><button class="btn" data-open="${safe(id)}">Read devotional</button><button class="btn" data-plan-read="${safe(id)}">${readDate(id)?'✓ Mark unread':'Mark as read'}</button></div></article>`:''}).join('')}</div>`;
}
function wirePlans(){
 document.querySelectorAll('[data-plan-continue]').forEach(b=>b.onclick=()=>{
  const p=planItems().find(x=>x.id===b.dataset.planContinue);
  if(!p)return;
  const next=p.devotional_ids.find(id=>!readDate(id));
  if(!next){selectedReadingPlan=p.id;nav('plan-detail');return}
  openFromReadingPlan(next,p.id);
 });

 document.querySelectorAll('[data-plan-open]').forEach(b=>b.onclick=()=>{selectedReadingPlan=b.dataset.planOpen;nav('plan-detail')});
 document.getElementById('planBack')?.addEventListener('click',()=>nav('plans'));
 document.getElementById('planStart')?.addEventListener('click',()=>{
  const p=planItems().find(x=>x.id===selectedReadingPlan);if(!p)return;
  localStorage.setItem(PLAN_ENROLL_KEY,JSON.stringify([...new Set([...planEnrollments(),p.id])]));
  openFromReadingPlan(p.devotional_ids.find(id=>!readDate(id))||p.devotional_ids[0],p.id);
 });
 document.getElementById('planLeave')?.addEventListener('click',()=>{localStorage.setItem(PLAN_ENROLL_KEY,JSON.stringify(planEnrollments().filter(id=>id!==selectedReadingPlan)));render()});
 document.querySelectorAll('[data-plan-read]').forEach(b=>b.onclick=()=>afterPlanReadingMarked(b.dataset.planRead));
}
async function loadCustomReadingPlans(){
 try{const response=await fetch('/api/reading-plans',{cache:'no-store'});if(response.ok){const plans=await response.json();if(Array.isArray(plans))customReadingPlans=plans}}catch(e){console.warn('Reading plans unavailable',e)}
 if(view==='plans'||view==='plan-detail'||view==='plan-complete')render();
}
let selectedReadingPlan='';
let activeReadingPlan=''; // Set only when a devotional was opened from a reading plan.


function openingSettings(){const chosen=localStorage.getItem(START_PAGE_KEY)||'today';return `<section class="hero" style="max-width:760px;margin:0 auto"><div class="eyebrow">Your reading experience</div><h1>Settings</h1><p>Choose where When Healing Doesn't Come opens on this device. You can change this anytime.</p></section><section class="card" style="max-width:760px;margin:0 auto 2rem"><h2>Opening page</h2><fieldset style="border:0;padding:0;margin:0"><legend class="muted small" style="margin-bottom:12px">When I launch the app, open:</legend><label style="display:block;margin:12px 0"><input type="radio" name="openingPage" value="today" ${chosen==='today'?'checked':''}> Devotional of the Day <span class="muted small">— Go straight to a devotional</span></label><label style="display:block;margin:12px 0"><input type="radio" name="openingPage" value="home" ${chosen==='home'?'checked':''}> Home <span class="muted small">— Start with the welcome page</span></label></fieldset><p class="muted small" id="openingSaved" role="status">Your choice is saved on this device.</p><p class="muted small">This setting applies when you launch the app again. Links to specific pages still work normally.</p></section>`}
// Offline reading is opt-in. Only published, public devotional data is stored.
const WHDC_OFFLINE_KEY='whdc-offline-public-devotionals-v1';
const READING_SIZE_KEY='whdc-reading-size';
const APPEARANCE_KEY='whdc-appearance';
function readingSize(){return Math.max(80,Math.min(150,Number(localStorage.getItem(READING_SIZE_KEY))||100))}
function appearance(){const a=localStorage.getItem(APPEARANCE_KEY);return ['light','dark','system'].includes(a)?a:'system'}
function applyReadingPreferences(){document.documentElement.style.setProperty('--whdc-reading-scale',String(readingSize()/100));const dark=appearance()==='dark'||(appearance()==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.body.classList.toggle('dark',dark);document.body.classList.remove('large')}
function audioReadingSettings(){return `<section class="card" style="max-width:760px;margin:0 auto 2rem"><h2>Audio Reading</h2><p class="muted small">Choose your preferred AI narration and device reading voices. AI narration is used when a recording exists. Otherwise your device reader is used.</p><div style="display:grid;gap:14px"><div><label for="settingsAiVoiceChoice" class="muted small">Default AI voice</label><div class="actions" style="gap:8px;align-items:center"><select id="settingsAiVoiceChoice" aria-label="Default AI voice"><option value="sulafat" ${preferredAIVoice()==='sulafat'?'selected':''}>Sulafat (female)</option><option value="sadachbia" ${preferredAIVoice()==='sadachbia'?'selected':''}>Sadachbia (male)</option></select><button class="btn" type="button" id="sampleAiVoice">▶ Sample</button></div><p id="aiSampleStatus" class="muted small" role="status"></p></div><div><label for="settingsDeviceVoiceChoice" class="muted small">Default device voice</label><div class="actions" style="gap:8px;align-items:center"><select id="settingsDeviceVoiceChoice" aria-label="Default device voice">${deviceVoiceOptions()}</select><button class="btn" type="button" id="sampleDeviceVoice">▶ Sample</button></div></div><div><label for="settingsvoiceSpeed" class="muted small">Default reading speed</label><select id="settingsvoiceSpeed" aria-label="Default reading speed">${speedOptions()}</select></div></div><p class="muted small">Preferences are saved on this device. AI samples are recorded once in the Audio Library and can be replayed without generating new audio.</p></section>`}
function readingAppearanceSettings(){const size=readingSize(),mode=appearance();return `<section class="card whdc-reading-settings" style="max-width:760px;margin:0 auto 2rem"><h2>Reading &amp; Appearance</h2><p class="muted small">Adjust how devotionals and Scripture appear on this device.</p><fieldset><legend>Reading text size</legend><div class="actions" style="align-items:center"><button type="button" class="btn" id="readingSmaller" aria-label="Decrease reading text size" ${size<=80?'disabled':''}>A−</button><output id="readingSizeValue" role="status" aria-label="Reading text size" aria-live="polite" aria-atomic="true">${size}%</output><button type="button" class="btn" id="readingLarger" aria-label="Increase reading text size" ${size>=150?'disabled':''}>A+</button><button type="button" class="btn" id="readingReset" aria-label="Reset reading text size to 100 percent">Reset</button></div><div class="whdc-reading-preview" aria-label="Reading text size preview"><div class="muted small whdc-preview-label">Text size preview</div><p id="readingPreviewText" aria-live="off">God is with us in every season, offering hope and strength for the journey ahead.</p></div></fieldset><fieldset><legend>Appearance theme</legend>${[['system','System Default'],['light','Light'],['dark','Dark']].map(([v,label])=>`<label class="whdc-appearance-option"><input type="radio" name="readingAppearance" value="${v}" ${mode===v?'checked':''}> ${label}</label>`).join('')}</fieldset><p class="muted small" role="status" id="readingPreferencesSaved">Your preferences are saved on this device.</p></section>`}
function wireReadingAppearanceSettings(){const update=()=>{applyReadingPreferences();const value=document.getElementById('readingSizeValue');if(value)value.textContent=readingSize()+'%';const preview=document.getElementById('readingPreviewText');if(preview)preview.style.fontSize=`${readingSize()}%`;const smaller=document.getElementById('readingSmaller'),larger=document.getElementById('readingLarger');if(smaller)smaller.disabled=readingSize()<=80;if(larger)larger.disabled=readingSize()>=150};const change=delta=>{localStorage.setItem(READING_SIZE_KEY,String(Math.max(80,Math.min(150,readingSize()+delta))));update()};document.getElementById('readingSmaller').onclick=()=>change(-10);document.getElementById('readingLarger').onclick=()=>change(10);document.getElementById('readingReset').onclick=()=>{localStorage.setItem(READING_SIZE_KEY,'100');update()};document.querySelectorAll('input[name="readingAppearance"]').forEach(r=>r.onchange=()=>{if(r.checked){localStorage.setItem(APPEARANCE_KEY,r.value);update()}})}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(appearance()==='system')applyReadingPreferences()});
function offlineReadingSettings(){
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem(WHDC_OFFLINE_KEY)||'null')}catch{}
 const count=Array.isArray(saved)?saved.length:0;
 return `<section class="card" style="max-width:760px;margin:20px auto"><h2>Offline Reading</h2>
 <p>Download published devotionals to read on this device without internet.</p>
 <p class="muted small">Connect to the internet to download or update your saved devotionals. External Bible links may still require internet.</p>
 <div class="actions"><button type="button" class="btn primary" id="downloadOfflineDevotionals">Download / Update Devotionals</button>
 <button type="button" class="btn" id="removeOfflineDevotionals">Remove Offline Download</button></div>
 <p class="muted small" id="offlineDownloadStatus" role="status">${count?count+' devotionals saved for offline reading.':'No devotionals downloaded yet.'}</p></section>`;
}
function wireOfflineReadingSettings(){
 const download=$('#downloadOfflineDevotionals'),remove=$('#removeOfflineDevotionals'),status=$('#offlineDownloadStatus');
 if(!download)return;
 download.onclick=async()=>{
  download.disabled=true;status.textContent='Downloading published devotionals…';
  try{
   const response=await fetch('/api/devotionals',{cache:'no-store'});
   if(!response.ok)throw Error('Unable to retrieve published devotionals.');
   const items=await response.json();validate(items);
   if(!items.length)throw Error('No published devotionals are available.');
   localStorage.setItem(WHDC_OFFLINE_KEY,JSON.stringify(items));
   status.textContent=items.length+' devotionals saved for offline reading on this device.';
  }catch(err){status.textContent='Download failed: '+err.message}
  finally{download.disabled=false}
 };
 remove.onclick=()=>{localStorage.removeItem(WHDC_OFFLINE_KEY);status.textContent='Offline download removed.'};
}
function wireOpeningSettings(){document.querySelectorAll('input[name="openingPage"]').forEach(r=>r.onchange=()=>{if(r.checked){localStorage.setItem(START_PAGE_KEY,r.value);const status=$('#openingSaved');if(status)status.textContent=`Saved! Your app will open to ${r.value==='today'?"Devotional of the Day":"Home"}.`}})}
function welcomeOpeningChoice(){if(!installedApp()||localStorage.getItem(START_PAGE_KEY)||!localStorage.getItem(VISITED_KEY))return;const overlay=document.createElement('div');overlay.id='openingPrompt';overlay.className='whdc-start-overlay';overlay.innerHTML=`<section class="card whdc-start-dialog" role="dialog" aria-modal="true" aria-labelledby="openingPromptTitle"><div class="eyebrow">Welcome back</div><h2 id="openingPromptTitle">Where would you like to begin?</h2><p>Choose the page you'd like to see when you open this app. You can change it later in Settings.</p><div class="actions" style="gap:12px;flex-wrap:wrap"><button class="btn primary" id="chooseToday" type="button">Devotional of the Day</button><button class="btn" id="chooseHome" type="button">Home</button></div></section>`;document.body.appendChild(overlay);const close=choice=>{localStorage.setItem(START_PAGE_KEY,choice);overlay.remove();view=choice;history.replaceState(null,'','#'+choice);render()};$('#chooseToday').onclick=()=>close('today');$('#chooseHome').onclick=()=>close('home');$('#chooseToday').focus()}
function addAppStyles(){if(document.getElementById('whdc-nav-styles'))return;const style=document.createElement('style');style.id='whdc-nav-styles';style.textContent=`.whdc-menu-button{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;width:46px;height:44px;padding:8px;border:0;background:transparent;color:inherit;border-radius:8px;margin-left:auto}.whdc-menu-button:hover,.whdc-menu-button:focus-visible{background:rgba(120,140,145,.12)}.whdc-menu-icon{display:flex;flex-direction:column;justify-content:space-between;width:25px;height:19px}.whdc-menu-icon span{display:block;width:100%;height:2.5px;border-radius:3px;background:currentColor}.whdc-header-top{position:relative;flex-wrap:nowrap!important;justify-content:space-between;overflow:visible}.whdc-nav{position:absolute;top:100%;right:0;left:auto;z-index:1000;box-sizing:border-box;width:190px;min-width:0;max-width:calc(100vw - 32px);display:flex;flex-direction:column;align-items:stretch;gap:0;padding:0;background:#fff;color:#293d3a;border:0;border-radius:0;box-shadow:0 12px 30px rgba(25,40,45,.18)}.whdc-nav .navbtn{display:flex;text-decoration:none!important;align-items:center;justify-content:center;width:100%;height:46px;box-sizing:border-box;text-align:center;font-size:16px!important;font-weight:500;line-height:1.35;white-space:nowrap;padding:0 8px;border:0;border-radius:0;background:#fff;color:#293d3a;transition:background-color .16s ease,color .16s ease}.whdc-nav .navbtn:nth-child(even){background:#fff}.whdc-nav .navbtn:hover,.whdc-nav .navbtn:focus-visible{ text-decoration:none!important;background:#7f9991;color:#fff;font-size:16px!important}.whdc-nav .navbtn[aria-current="page"],.whdc-nav .navbtn.active,.whdc-nav .navbtn:active{text-decoration:none!important;background:#7f9991;color:#fff;font-size:16px!important}.whdc-nav .navbtn[data-nav="home"]{letter-spacing:.46em;}.whdc-nav .navbtn[data-nav="today"]{letter-spacing:.29em;}.whdc-nav .navbtn[data-nav="topics"]{letter-spacing:.19em;}.whdc-nav .navbtn[data-nav="saved"]{letter-spacing:.31em;}.whdc-nav .navbtn[data-nav="history"]{letter-spacing:.10em;}.whdc-nav .navbtn[data-nav="support"]{letter-spacing:.20em;}.whdc-nav .navbtn[data-nav="contact"]{letter-spacing:.12em;}.whdc-nav .navbtn[data-nav="settings"]{letter-spacing:.07em;}.whdc-nav .navbtn[data-nav="bible"]{letter-spacing:.39em;}.home-reading > .reading{width:100%;max-width:760px;box-sizing:border-box;margin-left:auto;margin-right:auto}.whdc-nav[hidden]{display:none!important}.whdc-contact-card form label{display:block;margin-top:16px;margin-bottom:7px;font-weight:600}.whdc-contact-card form input:not([type=hidden]),.whdc-contact-card form textarea{display:block;width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #9da9a8;border-radius:9px;background:var(--card,#fff);color:inherit;font:inherit}.whdc-contact-card form textarea{resize:vertical}.whdc-contact-card form :focus-visible{outline:3px solid #6d9199;outline-offset:2px}.whdc-start-overlay{position:fixed;inset:0;z-index:9999;background:rgba(20,30,35,.65);display:flex;align-items:center;justify-content:center;padding:18px}.whdc-start-dialog{width:min(100%,480px);max-height:90vh;overflow:auto;padding:clamp(20px,4vw,36px)}@media(max-width:700px){.whdc-nav{position:absolute;top:100%;left:calc(50% - 50vw);right:auto;width:100vw;max-width:none;border-radius:0;padding:0;box-shadow:0 12px 25px rgba(25,40,45,.15)}.whdc-nav .navbtn{width:100%;text-align:center;padding:0 8px;border-radius:0;margin:0}}`;document.head.appendChild(style)}
function wireMenu(){const toggle=$('#menuToggle'),menu=$('#mainMenu');if(!toggle||!menu)return;toggle.onclick=()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu')};toggle.onkeydown=e=>{if(e.key==='Escape'&&!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}};menu.onkeydown=e=>{if(e.key==='Escape'){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}}}
function nav(v){if(v!=='today')activeReadingPlan='';clearOpenDevotional();if(v==='admin'){location.assign('/admin');return}if('speechSynthesis' in window)speechSynthesis.cancel();view=v;history.pushState(null,'',v==='admin'?'#admin':v==='explore'?'#explore':v==='topics'?'#topics':v==='saved'?'#saved':v==='history'?'#history':v==='study-guide'?'#study-guide':v==='saved-quotes'?'#saved-quotes':v==='favorite-verses'?'#favorite-verses':v==='journal'?'#journal':v==='plans'?'#plans':v==='milestones'?'#milestones':v==='plan-detail'?'#plan-detail':v==='plan-complete'?'#plan-complete':v==='support'?'#support':v==='contact'?'#contact':v==='settings'?'#settings':v==='home'?'#home':'#today');render();scrollTo(0,0)}function devotionalCardPreview(text,maxLength=155){
 const source=String(text||'');
 if(source.length<=maxLength)return formatInline(source);
 let end=maxLength;
 // Never cut an italic or bold Markdown span in half: doing so displays raw * markers.
 const spans=/\*\*([^*\n]+)\*\*|(^|[^*])\*([^*\n]+)\*/gm;
 for(const match of source.matchAll(spans)){
  const start=match.index+(match[2]?match[2].length:0);
  const finish=match.index+match[0].length;
  if(start<end&&finish>end)end=finish;
 }
 return formatInline(source.slice(0,end))+(end<source.length?'…':'');
}
function card(d){return `<article class="card"><div class="eyebrow">Day ${safe(d.day)} · ${safe((d.topics||[])[0]||'Devotional')}</div><h3>${safe(d.title)}</h3>${readBadge(d.id)}<div class="scripture">${safe(d.contextReferences||d.reference)}</div><p>${devotionalCardPreview(d.short)}</p><button class="btn" data-open="${safe(d.id)}">Read devotional →</button></article>`}const VOICE_KEY='whdc-voice',RATE_KEY='whdc-voice-rate';
function voiceChoices(){return ('speechSynthesis' in window)?speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('en')).sort((a,b)=>Number(b.localService)-Number(a.localService)||a.name.localeCompare(b.name)):[]}
const DEVICE_VOICE_KEY='whdc-device-voice';
function chosenVoice(){const list=voiceChoices(),name=localStorage.getItem(DEVICE_VOICE_KEY)||(!localStorage.getItem(VOICE_KEY)?.startsWith('recorded:')?localStorage.getItem(VOICE_KEY):'');return list.find(v=>v.voiceURI===name)||list.find(v=>/premium|enhanced|natural|samantha|ava|allison|serena|daniel/i.test(v.name))||list[0]||null}
function audioRate(){return Number(localStorage.getItem(RATE_KEY)||'1')}
const RECORDED_VOICE_KEY='whdc-recorded-voice';
function preferredAIVoice(){return localStorage.getItem(RECORDED_VOICE_KEY)||'sulafat'}
function selectedReadingVoice(){return localStorage.getItem(VOICE_KEY)||'recorded:'+preferredAIVoice()}
function devotionalRecordedVoices(){return ['sulafat','sadachbia'].filter(name=>!!window.WHDCAudio?.available?.('devotional')?.[name]?.url)}
function speedOptions(){return [['0.75','Slow (0.75×)'],['0.9','Gentle (0.9×)'],['1','Normal (1×)'],['1.15','Faster (1.15×)']].map(([n,t])=>`<option value="${n}" ${audioRate()===Number(n)?'selected':''}>${t}</option>`).join('')}
function deviceVoiceOptions(){const selected=chosenVoice()?.voiceURI||'';return `<option value="">Device automatic</option>`+voiceChoices().map(v=>`<option value="${safe(v.voiceURI)}" ${selected===v.voiceURI?'selected':''}>${safe(v.name)} (${safe(v.lang)})</option>`).join('')}
function voiceSettings(prefix='',recordedVoices=[]){const aiVoices=recordedVoices||[],preferred=preferredAIVoice(),active=selectedReadingVoice();const effective=aiVoices.length?'recorded:'+(aiVoices.includes(active.slice(9))&&active.startsWith('recorded:')?active.slice(9):aiVoices.includes(preferred)?preferred:aiVoices.includes('sulafat')?'sulafat':aiVoices[0]):(localStorage.getItem(DEVICE_VOICE_KEY)||'');return `<div class="actions" style="align-items:center;gap:6px;flex-wrap:wrap;font-size:.82rem"><label for="${prefix}voiceChoice" class="muted small">Reading voice</label><select id="${prefix}voiceChoice" aria-label="Reading voice" style="max-width:190px;width:100%;padding:5px 7px;font-size:.82rem;border-radius:8px;border:1px solid #aaa;background:var(--card,#fff);color:inherit">${aiVoices.length?aiVoices.map(v=>`<option value="recorded:${v}" ${effective==='recorded:'+v?'selected':''}>${v==='sulafat'?'Sulafat (female)':'Sadachbia (male)'}</option>`).join(''):`<option value="">Device automatic</option>${voiceChoices().map(v=>`<option value="${safe(v.voiceURI)}" ${effective===v.voiceURI?'selected':''}>${safe(v.name)} (${safe(v.lang)})</option>`).join('')}`}</select><label for="${prefix}voiceSpeed" class="muted small">Speed</label><select id="${prefix}voiceSpeed" aria-label="Reading speed" style="width:105px;max-width:105px;padding:5px 7px;font-size:.82rem;border-radius:8px;border:1px solid #aaa;background:var(--card,#fff);color:inherit">${speedOptions()}</select></div>`}
function wireVoiceSettings(prefix=''){
 if(prefix==='settings'){
  const ai=$('#settingsAiVoiceChoice'),device=$('#settingsDeviceVoiceChoice'),speed=$('#settingsvoiceSpeed');
  if(ai)ai.onchange=()=>{localStorage.setItem(RECORDED_VOICE_KEY,ai.value);localStorage.setItem(VOICE_KEY,'recorded:'+ai.value);window.WHDCAudio?.stop()};
  if(device)device.onchange=()=>{localStorage.setItem(DEVICE_VOICE_KEY,device.value);if('speechSynthesis' in window)speechSynthesis.cancel()};
  if(speed)speed.onchange=()=>{localStorage.setItem(RATE_KEY,speed.value);window.WHDCAudio?.setSpeed?.(Number(speed.value))};
  const aiButton=$('#sampleAiVoice'),deviceButton=$('#sampleDeviceVoice'),status=$('#aiSampleStatus');
  if(aiButton)aiButton.onclick=()=>{window.WHDCAudio?.stop();if('speechSynthesis' in window)speechSynthesis.cancel();const voice=ai?.value||'sulafat';const audio=new Audio('/api/audio/sample?voice='+encodeURIComponent(voice));aiButton.disabled=true;status.textContent='Loading saved sample…';audio.onended=()=>{aiButton.disabled=false;status.textContent=''};audio.onerror=()=>{aiButton.disabled=false;status.textContent='Sample not yet available. Generate it once in the Audio Library.'};audio.play().catch(()=>{aiButton.disabled=false;status.textContent='Unable to play sample.'})};
  if(deviceButton)deviceButton.onclick=()=>{if(!('speechSynthesis' in window))return;speechSynthesis.cancel();const utterance=makeNarration('When healing does not come, God is still near.');utterance.rate=audioRate();speechSynthesis.speak(utterance)};
  return;
 }
 const v=$('#voiceChoice'),r=$('#voiceSpeed');
 if(v)v.onchange=()=>{if(v.value.startsWith('recorded:'))localStorage.setItem(VOICE_KEY,v.value);else localStorage.setItem(DEVICE_VOICE_KEY,v.value);if('speechSynthesis' in window)speechSynthesis.cancel();window.WHDCAudio?.stop()};
 if(r)r.onchange=()=>{localStorage.setItem(RATE_KEY,r.value);window.WHDCAudio?.setSpeed?.(Number(r.value))};
}
if('speechSynthesis' in window){speechSynthesis.addEventListener('voiceschanged',()=>{const device=$('#settingsDeviceVoiceChoice');if(device){const selected=localStorage.getItem(DEVICE_VOICE_KEY)||'';device.innerHTML=deviceVoiceOptions();device.value=selected}const el=$('#voiceChoice');if(el&&!devotionalRecordedVoices().length){const temp=document.createElement('div');temp.innerHTML=voiceSettings('',[]);el.replaceChildren(...Array.from(temp.querySelector('select').options).map(o=>o.cloneNode(true)))}})}
function makeNarration(text){let u=new SpeechSynthesisUtterance(text);u.rate=audioRate();u.pitch=1.03;let v=chosenVoice();if(v)u.voice=v;return u}
if('speechSynthesis' in window){speechSynthesis.addEventListener('voiceschanged',()=>{for(const prefix of ['', 'settings']){const el=$('#'+prefix+'voiceChoice');if(!el)continue;const saved=selectedReadingVoice();const old=el.value;const temp=document.createElement('div');temp.innerHTML=voiceSettings(prefix,prefix==='settings'?null:devotionalRecordedVoices());const replacement=temp.querySelector('select');el.replaceChildren(...Array.from(replacement.options).map(o=>o.cloneNode(true)));el.value=Array.from(el.options).some(o=>o.value===(saved||old))?(saved||old):(el.options[0]?.value||'');}})}
// Main verse references from the reviewed 55-devotional migration.
// These are separate from the longer Scripture Reading passages.
const migratedMainScriptureReferences={"who-am-i":"Galatians 2:20","i-am-chosen":"Ephesians 1:4","i-am-loved":"Isaiah 54:10","i-am-adopted":"Romans 8:15","i-am-a-saint":"1 Corinthians 1:2","living-chosen":"2 Corinthians 12:9","what-is-rest":"Genesis 2:3","i-m-tired-of-resting":"Psalm 62:1","am-i-lazy":"2 Corinthians 12:9","rest-for-the-soul":"Matthew 11:28","a-lifestyle-of-rest":"Isaiah 30:15","the-pathway-of-trust":"Psalm 37:5","surrender-vs-obedience":"John 14:15","dwell-where-he-has-placed-you":"Psalm 37:3","when-god-answers-differently":"Psalm 37:4","stones-of-remembrance":"1 Samuel 7:12","yield-letting-go-of-control":"James 4:15","learning-to-float":"Isaiah 30:21","yield-making-room-for-others":"Colossians 3:13","yield-bearing-fruit":"Psalm 1:3","treasures-of-darkness":"Isaiah 45:3","what-if-i-never-get-better":"Proverbs 3:5","when-my-heart-needs-the-truth":"Psalm 31:14","his-bank-account-not-mine":"2 Corinthians 3:5","look-up":"Ephesians 3:19","the-lifter-of-my-head":"Psalm 3:3","when-words-are-not-enough":"Job 2:13","help-that-actually-helps":"Galatians 6:2","the-ministry-of-showing-up":"Romans 12:13","when-you-say-you-will-help":"1 John 3:18","no-one-should-suffer-alone":"1 Corinthians 12:26","when-the-darkness-doesn-t-lift":"2 Corinthians 1:8","why-are-you-cast-down-o-my-soul":"Psalm 42:5","healing-doesn-t-happen-in-a-day":"Psalm 42:11","walking-slowly-through-the-forest":"Psalm 139:23","the-whisper-after-the-storm":"1 Kings 19:12","not-needed-but-wanted":"Luke 19:40","a-quiet-life":"1 Timothy 2:1","using-my-limitations-for-good":"Micah 6:8","the-widow-s-two-coins":"Mark 12:44","purpose-from-my-bed":"Hebrews 10:24","the-perfect-mirror":"James 1:23","i-am-not-my-own":"Galatians 2:20","i-am-not-my-past":"2 Corinthians 5:17","the-roller-coaster-of-approval":"Galatians 1:10","i-am-not-defined-by-failure":"Romans 8:1","the-question-god-did-not-answer":"Exodus 3:11-12","humility-is-not-hating-yourself":"Numbers 12:3","blessed-does-not-mean-an-easy-life":"Ephesians 1:3","known-fully-invited-still":"John 4:10","blessed-to-reflect-his-kindness":"1 Peter 4:10","devotional-1792097012709":"1 John 4:7","devotional-1792124322179":"James 1:19","devotional-1792125237349":"Micah 6:8","devotional-1792126302645":"1 Corinthians 12:22"};
const mainScriptureReference=d=>d.mainScriptureReference||migratedMainScriptureReferences[d.id]||"";
function reader(d){if(!d)return '<p>No devotionals yet.</p>';let liked=favs().includes(d.id);return `<div class="reading"><div class="eyebrow">Day ${safe(d.day)} · ${safe((d.topics||[])[0]||'Devotional')}</div><h1>${safe(d.title)}</h1>${readBadge(d.id)}<div class="scripture">${safe(d.contextReferences||d.reference)}</div><div class="card" id="quoteSelectableDevotional"><div class="actions" style="align-items:center;gap:10px;flex-wrap:wrap"><button class="btn" id="listen" type="button">▶ Listen</button>${voiceSettings('',[])}</div>${d.mainScriptureText?`<div class="whdc-main-verse"><p><em>${safe(d.mainScriptureText)}</em></p><p class="small muted whdc-main-verse-reference">${safe(mainScriptureReference(d))}${mainScriptureReference(d)?" · WEBU":""}</p></div>`:""}<div class="whdc-quote-text">${para(d.short)}</div><div class="actions"><button class="btn" id="readScripture" type="button" aria-expanded="false" aria-controls="inlineScripture">Read Scripture ↓</button></div><section class="deep hidden" id="inlineScripture" aria-live="polite"></section><div class="actions"><button class="btn primary" id="deeper" aria-expanded="false" aria-controls="deepText">Go Deeper ↓</button></div><section class="deep hidden" id="deepText"><h3>Go Deeper</h3><div class="actions"><button class="btn" id="deeperListen" type="button">▶ Listen to Go Deeper</button></div><div class="whdc-quote-text">${para(d.deeper)}</div>${d.furtherStudyReferences?.trim()?`<p style="text-align:right;margin-top:1.25rem"><a href="/bible-reader.html?references=${encodeURIComponent(d.furtherStudyReferences)}" class="whdc-further-study-link">Scriptures for Further Study: ${safe(d.furtherStudyReferences.trim())} →</a></p>`:''}<p><a href="#" id="closeDeeperBottom" style="color:inherit;text-decoration:underline;text-underline-offset:3px">Close Section</a></p></section><div class="actions"><button class="btn reflection-btn" id="reflectionToggle" type="button" aria-expanded="false" aria-controls="reflectionText">Questions for Reflection ↓</button></div><section class="deep hidden" id="reflectionText"><h3>Questions for Reflection</h3>${d.reflection?.trim()?para(d.reflection):'<p>Use this space to reflect on what you have read.</p>'}${devotionalJournalForm(d)}<p><a href="#" id="closeReflectionBottom" style="color:inherit;text-decoration:underline;text-underline-offset:3px">Close Section</a></p></section><p class="whdc-author-credit">Written by ${safe(d.author||'Heather Kusunoki')}</p><span id="readingPlanAutoReadEnd" aria-hidden="true" style="display:block;height:1px"></span><div class="actions" role="group" aria-label="Devotional actions"><button class="btn" id="writeReflection" type="button" aria-label="Write a reflection" title="Write a reflection" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:64px;min-height:60px;padding:8px 10px"><span aria-hidden="true" style="font-size:1.35rem;line-height:1.2">✎</span><span aria-hidden="true" style="font-size:.75rem;line-height:1.2;font-weight:500">Reflect</span></button><button class="btn read-toggle" id="markRead" aria-pressed="${!!readDate(d.id)}" aria-label="${readDate(d.id)?'Mark as unread':'Mark as read'}" title="${readDate(d.id)?'Mark as unread':'Mark as read'}" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:64px;min-height:60px;padding:8px 10px"><span aria-hidden="true" style="font-size:1.35rem;line-height:1.2">${readDate(d.id)?'☑':'☐'}</span><span aria-hidden="true" style="font-size:.75rem;line-height:1.2;font-weight:500">Mark Read</span></button><button class="btn" id="favorite" aria-pressed="${liked}" aria-label="${liked?'Remove from saved':'Save devotional'}" title="${liked?'Remove from saved':'Save devotional'}" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:64px;min-height:60px;padding:8px 10px"><span aria-hidden="true" style="font-size:1.35rem;line-height:1.2">${liked?'♥':'♡'}</span><span aria-hidden="true" style="font-size:.75rem;line-height:1.2;font-weight:500">Saved</span></button><button class="btn" id="shareDevotional" type="button" aria-label="Share this devotional" title="Share this devotional" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:64px;min-height:60px;padding:8px 10px"><span aria-hidden="true" style="font-size:1.35rem;line-height:1.2">↗</span><span aria-hidden="true" style="font-size:.75rem;line-height:1.2;font-weight:500">Share</span></button></div></div>`}
// Make Scripture citations within a devotional open WHDC's own Bible Reader.
// Text-node linking preserves existing markup, controls, and user-written reflections.
const WHDC_BIBLE_BOOKS=['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Psalm','Proverbs','Proverb','Ecclesiastes','Song of Solomon','Song of Songs','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];
const WHDC_BIBLE_CODES=['GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PSA','PRO','PRO','ECC','SNG','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL','MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'];
const WHDC_BIBLE_ALIASES={'ps':'Psalms','psa':'Psalms','psalm':'Psalms','prov':'Proverbs','pro':'Proverbs','matt':'Matthew','mt':'Matthew','mk':'Mark','mrk':'Mark','lk':'Luke','jn':'John','jhn':'John','rom':'Romans','rev':'Revelation','phil':'Philippians','php':'Philippians','1 cor':'1 Corinthians','2 cor':'2 Corinthians','1 thess':'1 Thessalonians','2 thess':'2 Thessalonians','1 tim':'1 Timothy','2 tim':'2 Timothy','1 pet':'1 Peter','2 pet':'2 Peter','1 jn':'1 John','2 jn':'2 John','3 jn':'3 John'};
const whdcEscapeRegex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const WHDC_REFERENCE_NAMES=[...new Set([...WHDC_BIBLE_BOOKS,...Object.keys(WHDC_BIBLE_ALIASES)])].sort((a,b)=>b.length-a.length).map(whdcEscapeRegex).join('|');
const WHDC_REFERENCE_REGEX=new RegExp(String.raw`\b(${WHDC_REFERENCE_NAMES})\.?\s+(\d{1,3})(?::(\d{1,3})(?:\s*[-–]\s*\d{1,3})?(?:\s*,\s*\d{1,3}(?:\s*[-–]\s*\d{1,3})?)*)?(?:\s*[-–]\s*\d{1,3}:\d{1,3})?`,'gi');
function whdcBibleReferenceUrl(ref){
 const match=String(ref).match(/^(.+?)\.?\s+(\d{1,3})/);
 if(!match)return '/bible-reader.html?references='+encodeURIComponent(ref);
 const key=match[1].trim().toLowerCase(),canonical=WHDC_BIBLE_ALIASES[key]||WHDC_BIBLE_BOOKS.find(b=>b.toLowerCase()===key);
 const idx=WHDC_BIBLE_BOOKS.indexOf(canonical);
 const params=new URLSearchParams({references:ref});
 if(idx>=0){params.set('book',WHDC_BIBLE_CODES[idx]);params.set('chapter',match[2])}
 return '/bible-reader.html?'+params.toString();
}
function linkDevotionalScriptureReferences(){
 const root=document.querySelector('.reading');if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const targets=[];
 while(walker.nextNode()){
  const node=walker.currentNode,el=node.parentElement;
  if(!el||!node.nodeValue.trim()||el.closest('a,button,script,style,textarea,input,select,option,[contenteditable],#devotionalJournal,#journalForm,.whdc-context-text,.whdc-main-verse em'))continue;
  if(!el.closest('.scripture,.whdc-main-verse-reference,.card,.deep'))continue;
  WHDC_REFERENCE_REGEX.lastIndex=0;
  if(WHDC_REFERENCE_REGEX.test(node.nodeValue))targets.push(node);
 }
 for(const node of targets){
  const text=node.nodeValue,frag=document.createDocumentFragment();let last=0;
  WHDC_REFERENCE_REGEX.lastIndex=0;
  for(const match of text.matchAll(WHDC_REFERENCE_REGEX)){
   if(match.index>last)frag.append(document.createTextNode(text.slice(last,match.index)));
   const a=document.createElement('a');a.href=whdcBibleReferenceUrl(match[0]);a.textContent=match[0];a.title='Open '+match[0]+' in Bible Reader';a.className='whdc-scripture-reference-link';
   frag.append(a);last=match.index+match[0].length;
  }
  if(last){if(last<text.length)frag.append(document.createTextNode(text.slice(last)));node.replaceWith(frag)}
 }
}

function scriptureSections(d){
  const refs=String(d.contextReferences||d.reference||'').split(/;|\\n/).map(x=>x.trim()).filter(Boolean);
  return refs.length?refs:[String(d.reference||'')];
}
function scriptureParagraphs(verses){
  const blocks=[];let pieces=[],previousChapter='';
  const flush=()=>{if(pieces.length){blocks.push('<p>'+pieces.join(' ')+'</p>');pieces=[]}};
  for(const v of verses){
    const chapter=String(v.chapter??'');
    const number=String(v.verse??'');
    if(chapter&&previousChapter&&chapter!==previousChapter)flush();
    if(chapter)previousChapter=chapter;
    const chapterMark=chapter&&(number==='1'||(pieces.length===0&&blocks.length===0))?`<span class="whdc-context-chapter" aria-label="Chapter ${safe(chapter)}">${safe(chapter)}</span>`:'';
    pieces.push(`${chapterMark}<sup class="whdc-context-verse" aria-label="Verse ${safe(number)}">${safe(number)}</sup>${safe(v.text)}`);
  }
  flush();return blocks.join('');
}
function scriptureMarkup(d){
  const body=scriptureLoading?'<p role="status">Loading Scripture…</p>':scriptureError?`<p role="alert">${safe(scriptureError)}</p>`:scriptureData?scriptureData.map((section,i)=>`<section class="whdc-context-passage" aria-label="${safe(section.reference)}"><h4>${safe(section.reference)}</h4><div class="whdc-context-text">${scriptureParagraphs(section.verses)}</div></section>`).join(''):'<p>Open this section to read Scripture.</p>';
  return `<h3>Scripture Reading</h3><div class="actions"><button class="btn" id="scriptureListen" type="button" ${!scriptureData?'disabled':''}>▶ Listen to Scripture</button></div>${body}<p class="muted small">World English Bible Updated (WEBU), public domain.</p><div class="actions"><a href="#" id="closeScriptureBottom" style="color:inherit;text-decoration:underline;text-underline-offset:3px">Close Section</a></div>`;
}
function updateScripture(){let panel=$('#inlineScripture'),button=$('#readScripture'),d=current();if(!panel||!button||!d)return;let opened=scriptureOpen&&scriptureForId===d.id;panel.classList.toggle('hidden',!opened);button.setAttribute('aria-expanded',String(opened));button.textContent=opened?'Close ↑':'Read Scripture ↓';if(opened){panel.innerHTML=scriptureMarkup(d);let close=$('#closeScriptureBottom');if(close)close.onclick=e=>{e.preventDefault();scriptureOpen=false;if('speechSynthesis' in window)speechSynthesis.cancel();updateScripture();let top=$('#readScripture');if(top){top.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});top.focus({preventScroll:true})}};let audio=$('#scriptureListen');if(audio)audio.onclick=()=>{if(window.WHDCAudio?.play('scripture',audio))return;if(!('speechSynthesis' in window)){alert('Audio reading is not supported in this browser.');return}if(speechSynthesis.speaking){speechSynthesis.cancel();audio.textContent='▶ Listen to Scripture';return}if(!scriptureData)return;let u=makeNarration(d.reference+'. '+scriptureData.map(p=>p.reference+'. '+p.verses.map(v=>v.text).join(' ')).join(' '));u.onend=u.onerror=()=>{let b=$('#scriptureListen');if(b)b.textContent='▶ Listen to Scripture'};speechSynthesis.speak(u);audio.textContent='■ Stop audio'}}}
async function toggleScripture(d){
 if(scriptureOpen&&scriptureForId===d.id){scriptureOpen=false;if('speechSynthesis' in window)speechSynthesis.cancel();updateScripture();return}
 scriptureForId=d.id;scriptureOpen=true;scriptureRef=d.contextReferences||d.reference;scriptureURL=d.bibleUrl;scriptureData=null;scriptureError='';scriptureLoading=true;updateScripture();
 try{
  const refs=scriptureSections(d);
  let sections;
  if(d.contextPassages?.length && d.contextPassages.length===refs.length){
   sections=d.contextPassages.map((p,i)=>({reference:refs[i],verses:p.verses||[]}));
  }else{
   sections=await Promise.all(refs.map(async reference=>{
    const response=await fetch('/api/scripture?reference='+encodeURIComponent(reference),{cache:'no-store'});
    if(!response.ok)throw Error('Local Scripture service unavailable');
    const result=await response.json();
    if(!Array.isArray(result.verses)||!result.verses.length)throw Error('No verses returned');
    return {reference,verses:result.verses};
   }));
  }
  if(sections.some(p=>!p.verses.length))throw Error('No verses returned');
  if(scriptureForId!==d.id)return;
  scriptureData=sections;
 }catch(e){if(scriptureForId===d.id)scriptureError='We could not load the passage from the locally hosted WEBU Bible. Please try again.'}
 finally{if(scriptureForId===d.id){scriptureLoading=false;updateScripture()}}
}
function admin(){let drafts=load(KEY,null);return `<section class="hero"><div class="eyebrow">Writer's workspace</div><h1>Devotional dashboard</h1><p>Write, edit, and export your devotionals. This first dashboard saves only in this browser. It does not publish changes automatically.</p></section><div class="notice warning"><strong>Important:</strong> Back up with “Export JSON” after every writing session. Browser data can be cleared or lost. To publish to your website, replace <code>content.json</code> in your project with the exported file and redeploy.</div><div class="actions"><button class="btn primary" id="new">+ New devotional</button><button class="btn" id="export">↓ Export JSON</button><label class="btn" for="import" style="margin:0">↑ Import JSON</label><input id="import" type="file" accept="application/json,.json" class="hidden"></div><div class="admin-list">${data.slice().sort((a,b)=>a.day-b.day).map(d=>`<div class="admin-item"><div><strong>${safe(d.title)}</strong><div class="small muted">Day ${safe(d.day)} · ${safe(d.reference)}</div></div><button class="btn" data-edit="${safe(d.id)}">Edit</button></div>`).join('')}</div><div id="editor"></div>`}function form(d){return `<form class="card" id="write"><h2>${d?'Edit':'New'} devotional</h2><label for="title">Title</label><input id="title" required maxlength="150" value="${safe(d?.title||'')}"><label for="day">Day number</label><input id="day" type="number" min="1" required value="${safe(d?.day||data.length+1)}"><label for="topicsField">Topics</label><input id="topicsField" placeholder="Waiting, Hope, Rest" value="${safe((d?.topics||[]).join(', '))}"><p class="hint">Separate topics with commas.</p><label for="reference">Scripture reference</label><input id="reference" required placeholder="Psalm 13:1–6" value="${safe(d?.reference||'')}"><label for="bibleUrl">Bible passage URL</label><input id="bibleUrl" type="url" required placeholder="https://ebible.org/web/PSA13.htm" value="${safe(d?.bibleUrl||'')}"><p class="hint">Use a verified World English Bible chapter URL from ebible.org.</p><label for="short">Short devotional</label><textarea id="short" rows="9" required>${safe(d?.short||'')}</textarea><label for="long">Go Deeper study</label><textarea id="long" rows="13" required>${safe(d?.deeper||'')}</textarea><div class="actions"><button class="btn primary" type="submit">Save draft</button><button class="btn" type="button" id="preview">Preview reading</button><button class="btn" type="button" id="cancel">Cancel</button>${d?'<button class="btn" type="button" id="delete">Delete</button>':''}</div></form>`}function contactPage(){return `<section class="hero" aria-labelledby="contactTitle" style="text-align:center;margin:0 auto;max-width:780px"><div class="eyebrow">Stay in touch</div><h1 id="contactTitle">Contact</h1><p style="margin-left:auto;margin-right:auto;text-align:center">Have a question, a prayer request, or a story you would like to share? I would love to hear from you.</p></section><section class="card whdc-contact-card" style="max-width:780px;margin:0 auto 2rem;padding:clamp(20px,4vw,42px)"><h2>Send a Message</h2><p>Thank you for reaching out! Please use the form below. I read messages as I am able, but because of my health limitations, responses may take some time.</p><form id="contactForm"><div class="hidden" aria-hidden="true"><label for="contactWebsite">Leave this field blank</label><input id="contactWebsite" name="website" type="text" tabindex="-1" autocomplete="off"></div><label for="contactName">Your name</label><input id="contactName" name="name" type="text" autocomplete="name" maxlength="120" required placeholder="Your name"><label for="contactEmail">Your email address</label><input id="contactEmail" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="you@example.com"><label for="contactMessage">Your message</label><textarea id="contactMessage" name="message" rows="7" maxlength="10000" required placeholder="Write your message here..."></textarea><div class="actions" style="margin-top:18px"><button class="btn primary" id="contactSubmit" type="submit">Send Message →</button></div><p class="muted small" id="contactStatus" role="status"></p></form></section>`}
function supportPage(){return `<section class="hero" aria-labelledby="supportTitle" style="text-align:center;margin:0 auto;max-width:780px"><div class="eyebrow">A note from the author</div><h1 id="supportTitle">Support This Ministry</h1><p style="margin-left:auto;margin-right:auto;text-align:center">Helping share hope and encouragement through life's hardest seasons.</p></section><section class="card" style="max-width:780px;margin:0 auto 2rem;padding:clamp(20px,4vw,42px)"><h2>Thank you for being here</h2><p>In November 2021, my life changed when I became sick with Long COVID. After thirteen years of working as a NICU nurse, I was no longer able to work, and much of the life I had known came to a sudden halt. These past five years have been filled with unexpected challenges, physical limitations, and the ongoing process of learning to trust God when healing doesn't come the way I hoped. While I continue to pray for healing and celebrate the small improvements along the way, I am also learning that God can use me right where I am, even in my weakness.</p><p><em>When Healing Doesn't Come</em> grew out of that journey. My hope is that these devotionals will encourage others who are walking through chronic illness, suffering, or difficult seasons of waiting, reminding them that God has not forgotten them and that their lives still have purpose.</p><p>If these devotionals have encouraged you and you would like to support me personally or help me continue creating resources like this, you can do so through Venmo or Square. There is absolutely no obligation to give. Your prayers, encouragement, and willingness to share these devotionals with others mean so much to me.</p><p>Thank you for being part of this journey and for helping me share the hope we have in Christ, even when healing doesn't come.</p><h2 style="margin-top:2rem">Ways to Give</h2><div class="actions" style="display:flex;gap:12px;flex-wrap:wrap;margin:1rem 0">${SUPPORT_VENMO_URL?`<a class="btn primary" href="${safe(SUPPORT_VENMO_URL)}" target="_blank" rel="noopener noreferrer">Give with Venmo ↗</a>`:`<span class="btn" aria-label="Venmo donation link coming soon" style="opacity:.65;cursor:default">Venmo · Coming soon</span>`}${SUPPORT_SQUARE_URL?`<a class="btn" href="${safe(SUPPORT_SQUARE_URL)}" target="_blank" rel="noopener noreferrer">Give with Square ↗</a>`:`<span class="btn" aria-label="Square donation link coming soon" style="opacity:.65;cursor:default">Square · Coming soon</span>`}</div><p class="muted small">Gifts are personal support and are not represented as tax-deductible charitable donations.</p><p class="muted small">Not able to give? Sharing a devotional with a friend and praying for this ministry are wonderful ways to help.</p></section>`}
const ANNOUNCEMENT_SEEN_KEY='whdc-announcement-seen-revision';
async function checkNewAnnouncementOnArrival(){
 try{const r=await fetch('/api/announcement',{cache:'no-store'});if(!r.ok)return;const a=await r.json();if(!a.visible||!Number(a.revision))return;
 const revision=Number(a.revision),seen=Number(localStorage.getItem(ANNOUNCEMENT_SEEN_KEY)||0);
 if(view==='home'){localStorage.setItem(ANNOUNCEMENT_SEEN_KEY,String(revision));return;}
 if(view==='today'&&revision>seen){view='home';history.replaceState(null,'','#home');render();window.scrollTo(0,0);}
 }catch(e){console.warn('Announcement check unavailable',e)}
}
async function loadHomeAnnouncement(){
 const section=document.getElementById('whdcAnnouncement');if(!section)return;
 try{const response=await fetch('/api/announcement',{cache:'no-store'});if(!response.ok)return;const info=await response.json();if(!info.visible||!info.body||!document.contains(section))return;if(Number(info.revision))localStorage.setItem(ANNOUNCEMENT_SEEN_KEY,String(info.revision));
 const heading=section.querySelector('#whdcAnnouncementTitle'),content=section.querySelector('#whdcAnnouncementBody');
 heading.textContent=info.title||"What's New";
 content.replaceChildren();for(const paragraph of String(info.body).split(/\n\s*\n/)){if(!paragraph.trim())continue;const p=document.createElement('p');p.innerHTML=formatAnnouncementText(paragraph.trim());p.style.whiteSpace='pre-line';content.appendChild(p)}
 section.hidden=false;
 }catch(e){console.warn('Announcement unavailable',e)}
}
function formatAnnouncementText(text){
 // Safely render the announcement's simple Markdown, including nested bold/italic.
 // Escape source text first: announcement content is never trusted HTML.
 const escapeHtml=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
 const source=String(text);
 function renderRange(start,end){
  let html='';
  for(let i=start;i<end;){
   const marker=source.startsWith('**',i)?'**':source[i]==='*'?'*':null;
   if(marker){
    const close=source.indexOf(marker,i+marker.length);
    if(close>i+marker.length&&close<end){
     const tag=marker==='**'?'strong':'em';
     html+='<'+tag+'>'+renderRange(i+marker.length,close)+'</'+tag+'>';
     i=close+marker.length;
     continue;
    }
   }
   html+=escapeHtml(source[i]);i++;
  }
  return html;
 }
 return renderRange(0,source.length);
}
function addExploreStyles(){if(document.getElementById('whdc-explore-style'))return;const style=document.createElement('style');style.id='whdc-explore-style';style.textContent=`.whdc-explore-hub{max-width:760px;margin:0 auto 2rem}.whdc-explore-feature,.whdc-explore-tile{font:inherit;color:var(--ink,inherit);background:var(--card,#fff);border:1px solid var(--line,#cbd5cf);border-radius:15px;cursor:pointer;text-align:left;box-shadow:0 2px 10px rgba(30,50,40,.04)}.whdc-explore-feature{display:flex;align-items:center;gap:16px;width:100%;min-height:100px;padding:20px;margin-bottom:14px}.whdc-explore-copy{display:flex;flex-direction:column;gap:5px;flex:1}.whdc-explore-copy strong{font-size:1.13rem}.whdc-explore-feature small,.whdc-explore-tile small{font-size:.84rem;opacity:.78}.whdc-explore-symbol{display:grid;place-items:center;width:48px;height:48px;flex:none;border-radius:12px;background:rgba(115,151,137,.18);color:var(--ink,#385448);font-size:1.6rem}.whdc-explore-arrow{font-size:2rem;opacity:.65}.whdc-explore-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.whdc-explore-tile{display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-height:145px;padding:18px}.whdc-explore-tile strong{font-size:1.02rem}.whdc-explore-feature:focus-visible,.whdc-explore-tile:focus-visible{outline:3px solid #477f76;outline-offset:3px}@media(max-width:700px){.home-more{display:none!important}}@media(max-width:380px){.whdc-explore-grid{gap:9px}.whdc-explore-tile{padding:14px;min-height:130px}.whdc-explore-feature{padding:15px}}`;document.head.appendChild(style)}
function render(){document.getElementById("saveQuoteSelection")?.remove();stopPlanAutoRead();addExploreStyles();window.WHDCAudio?.stop();let allTopics=['All',...new Set(data.flatMap(d=>(d.topics||[]).map(t=>String(t).trim()).filter(Boolean)))].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b));if(selectedTopic!=='All'&&!allTopics.includes(selectedTopic))selectedTopic='All';let body=view==='home'?`<section id="whdcAnnouncement" class="whdc-announcement" hidden aria-label="What's New"><h2 id="whdcAnnouncementTitle"></h2><div id="whdcAnnouncementBody"></div></section><section class="hero home-hero"><h2>Devotions for Life's Hardest Seasons</h2><p><em>When Healing Doesn’t Come</em> is a devotional app designed to meet you right where you are, offering biblical encouragement through chronic illness, suffering, and seasons of waiting.</p><p>Whether you need encouragement for something specific or simply want to spend time in God’s Word, you can browse devotionals by topic or start with Devotional of the Day. Each devotional includes a short reading for days when your energy is limited, an audio option when listening is easier than reading, and a deeper study with reflection questions for days when you have more capacity.</p><p>Save your favorites, keep track of what you’ve read, and revisit devotionals whenever you need them. There’s no schedule to follow, no pressure to keep up, and no missed days to make up. Just time in God’s Word, at your own pace.</p><p>You can personalize your reading experience in <strong>Settings</strong>: choose your opening page, adjust text size, choose Light, Dark, or System Default appearance, choose your AI reader voice and speed (when available) and manage offline reading options.</p></section><section class="home-topics" aria-labelledby="exploreHeading"><h2 id="exploreHeading">Find a Place to Begin</h2><p>Browse devotionals by what you're walking through or let us choose.</p><div class="actions"><button class="btn home-explore-button" data-nav="topics" type="button">Browse by Topic →</button><button class="btn primary" data-nav="today" type="button">Go to Devotion of the Day →</button><button class="btn" id="shareThisApp" type="button" aria-label="Share When Healing Doesn’t Come with someone">↗ Share This App</button></div></section><section class="home-divider" role="img" aria-label="Misty mountain landscape" style="min-height:205px;margin:2.8rem 0 3rem;border-radius:18px;overflow:hidden;background:#dce6df url('/images/misty-mountain-divider.jpg') center 58% / cover no-repeat"></section>`:view==='today'?`<section class="home-reading" id="todayPickSection" aria-labelledby="featuredHeading">${location.hash.startsWith('#devotional/')?'':'<h1 id="featuredHeading" class="today-featured-heading"><img class="today-featured-banner" src="/images/todays-pick-banner.png" alt="Today’s Pick, misty mountains at sunrise" /></h1>'}${planReaderNavigation()}${reader(current())}${planReaderFooter()}</section><section class="home-more"><h2>Explore by topic</h2><p>Choose a topic to find devotionals for what you’re walking through.</p><div class="topics">${allTopics.filter(t=>t!=='All').map(t=>`<button class="chip" type="button" data-home-topic="${safe(t)}">${safe(t)}</button>`).join('')}</div></section>`:view==='study-guide'?studyGuidePage():view==='saved-quotes'?savedQuotesPage():view==='favorite-verses'?favoriteVersesPage():view==='journal'?journalPage():view==='milestones'?`<section class="hero"><div class="eyebrow">At your own pace</div><h1>Reading Milestones</h1><p>A quiet place to reflect on time spent in Scripture. No streaks or deadlines.</p></section>${readingMilestones()}`:view==='plans'?planOverview():view==='plan-complete'?(planItems().find(p=>p.id===selectedReadingPlan)?planCompletionMessage(planItems().find(p=>p.id===selectedReadingPlan)):planOverview()):view==='plan-detail'?planDetail():view==='explore'?`<section class="hero whdc-explore-heading"><div class="eyebrow">Find encouragement</div><h1>Explore</h1><p>There’s more to discover! Explore the tools and features available to help you engage with Scripture, reflect on what God is teaching you, and grow in your walk with Him.</p></section><section class="whdc-explore-hub" aria-label="Explore WHDC"><button type="button" class="whdc-explore-feature" data-nav="topics"><span class="whdc-explore-symbol" aria-hidden="true">☷</span><span class="whdc-explore-copy"><strong>Browse by Topic</strong><small>Find devotionals by theme</small></span><span class="whdc-explore-arrow" aria-hidden="true">›</span></button><div class="whdc-explore-grid"><button type="button" class="whdc-explore-tile" data-nav="plans"><span class="whdc-explore-symbol" aria-hidden="true">▤</span><strong>Reading Plans</strong><small>Series & guided plans</small></button><button type="button" class="whdc-explore-tile" data-nav="journal"><span class="whdc-explore-symbol" aria-hidden="true">✎</span><strong>My Journal</strong><small>Prayers & reflections</small></button><button type="button" class="whdc-explore-tile" data-nav="study-guide"><span class="whdc-explore-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:auto"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z"/></svg></span><strong>Inductive Bible Study</strong><small>Study guide &amp; notes</small></button><button type="button" class="whdc-explore-tile" data-nav="favorite-verses"><span class="whdc-explore-symbol" aria-hidden="true">♡</span><strong>My Favorite Verses</strong><small>Saved Scripture & memory practice</small></button><button type="button" class="whdc-explore-tile" data-nav="saved"><span class="whdc-explore-symbol" aria-hidden="true">☆</span><strong>Saved</strong><small>Your favorites</small></button><button type="button" class="whdc-explore-tile" data-nav="saved-quotes"><span class="whdc-explore-symbol" aria-hidden="true">❝</span><strong>Saved Quotes</strong><small>Favorite words from devotionals</small></button><button type="button" class="whdc-explore-tile" data-nav="history"><span class="whdc-explore-symbol" aria-hidden="true">◷</span><strong>Reading Log</strong><small>Previously read</small></button><button type="button" class="whdc-explore-tile" data-nav="milestones"><span class="whdc-explore-symbol" aria-hidden="true">✧</span><strong>Reading Milestones</strong><small>Moments in Scripture</small></button><button type="button" class="whdc-explore-tile" data-nav="support"><span class="whdc-explore-symbol" aria-hidden="true">♡</span><strong>Donate</strong><small>Support WHDC</small></button><button type="button" class="whdc-explore-tile" data-nav="contact"><span class="whdc-explore-symbol" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span><strong>Contact</strong><small>Get in touch</small></button></div></section>`:view==='topics'?`<section class="hero"><div class="eyebrow">Find what you need</div><h1>Browse by topic</h1><p>Start where you are today.</p></section><div class="topics">${allTopics.map(t=>`<button class="chip ${selectedTopic===t?'active':''}" data-topic="${safe(t)}">${safe(t)}</button>`).join('')}</div><div class="grid">${data.filter(d=>selectedTopic==='All'||(d.topics||[]).includes(selectedTopic)).map(card).join('')||'<p>No published devotionals in this topic yet. More are being prepared.</p>'}</div>`:view==='history'?`<section class="hero"><div class="eyebrow">Your reading journey</div><h1>Reading Log</h1><p>Revisit the devotionals you've read, and see when you last marked each one as read. There's no schedule to keep up with.</p></section><p class="muted small">${data.filter(d=>readDate(d.id)).length} of ${data.length} published devotionals marked as read on this device.</p><div class="grid">${data.filter(d=>readDate(d.id)).sort((a,b)=>String(readDate(b.id)).localeCompare(String(readDate(a.id)))||String(a.title).localeCompare(String(b.title))).map(card).join('')||'<div class="empty">No readings marked as read yet. Open a devotional and select “Mark as read” to begin your history.</div>'}</div><p class="muted small">Your reading history is stored in this browser, not in an account. It may not appear on other devices and can be lost if browser data is cleared.</p>`:view==='support'?supportPage():view==='contact'?contactPage():view==='saved'?`<section class="hero"><div class="eyebrow">Your quiet space</div><h1>Saved readings</h1><p>Return whenever you like. No streaks and no missed days.</p></section><div class="grid">${data.filter(d=>favs().includes(d.id)).map(card).join('')||'<div class="empty">Nothing saved yet. Open a devotional and tap “Save for later.”</div>'}</div>`:view==='settings'?openingSettings()+readingAppearanceSettings()+audioReadingSettings()+offlineReadingSettings()+notificationSettings():admin();$('#app').innerHTML=`<header><div class="wrap top whdc-header-top"><a class="brand" href="#home" aria-label="When Healing Doesn't Come, home"><img class="header-logo" src="/images/header-logo.png" alt="When Healing Doesn't Come"></a><button class="btn whdc-menu-button" id="menuToggle" type="button" aria-controls="mainMenu" aria-expanded="false" aria-label="Toggle navigation menu" title="Menu"><span class="whdc-menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button><nav id="mainMenu" class="whdc-nav" aria-label="Main navigation" hidden></nav></div></header><main class="wrap">${body}</main><footer class="footer"><div class="wrap" style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px 28px;flex-wrap:wrap"><div style="flex:1 1 340px">&copy; 2026 When Healing Doesn't Come · Hope for the Journey<p class="muted small">Scripture reading uses the public-domain World English Bible (WEB).</p></div><div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;padding-top:2px"><a href="/get-app.html" id="shareAppFooter" class="get-app-footer-link">Share App</a><a href="/admin" target="_blank" rel="noopener noreferrer" class="get-app-footer-link">Login</a></div></div></footer>`;addAppStyles();window.WHDCNav.render(document.getElementById('mainMenu'),view,true);window.WHDCNav.bottomNav(view==='topics'?'explore':view,true);wireMenu();document.getElementById('shareAppFooter')?.addEventListener('click',e=>{e.preventDefault();shareThisApp();});wirePlans();wireJournal();wireFavoriteVerses();wireSavedQuotes();wireStudyGuide();linkDevotionalScriptureReferences();wireDevotionalQuoteSelection();document.getElementById('writeReflection')?.addEventListener('click',startDevotionalReflection);wirePlanReaderNavigation();wirePlanAutoRead();wirePlanCompletion();if(view==='home'){loadHomeAnnouncement();const shareAppButton=document.getElementById('shareThisApp');if(shareAppButton)shareAppButton.addEventListener('click',shareThisApp);}if(view==='settings'){wireOpeningSettings();wireNotificationSettings();wireReadingAppearanceSettings();wireVoiceSettings('settings');wireOfflineReadingSettings();}if(view==='contact'){
 const form=$('#contactForm'),status=$('#contactStatus'),button=$('#contactSubmit');
 if(form&&status&&button)form.addEventListener('submit',async e=>{
  e.preventDefault();if(button.disabled)return;
  button.disabled=true;button.textContent='Sending…';status.textContent='Sending your message. Please wait…';status.setAttribute('role','status');
  try{
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
   let response;
   try{response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.elements.name.value,email:form.elements.email.value,message:form.elements.message.value,website:form.elements.website.value}),signal:controller.signal})}
   finally{clearTimeout(timer)}
   const result=await response.json().catch(()=>({}));
   if(!response.ok||!result.ok)throw Error(result.error||'Your message could not be sent. Please try again.');
   form.reset();status.textContent='Thank you! Your message has been sent successfully.';
  }catch(err){status.textContent=err.name==='AbortError'?'Sending took too long. Please check your connection and try again. If unsure, contact us before resending.':err.message||'Something went wrong. Please try again.'}
  finally{button.disabled=false;button.textContent='Send Message →'}
 })
};const homeBrand=document.querySelector('.brand');if(homeBrand)homeBrand.onclick=e=>{e.preventDefault();nav('home')};document.querySelectorAll('button[data-nav]').forEach(b=>b.onclick=()=>nav(b.dataset.nav));document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{if(view==='plan-detail'){openFromReadingPlan(b.dataset.open,selectedReadingPlan);return}activeReadingPlan='';currentId=b.dataset.open;scriptureOpen=false;scriptureForId=null;view='today';rememberOpenDevotional(currentId);render();scrollTo(0,0)});document.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{selectedTopic=b.dataset.topic;render()});document.querySelectorAll('[data-home-topic]').forEach(b=>b.onclick=()=>{selectedTopic=b.dataset.homeTopic;nav('topics')});if(view==='today'&&current()){$('#readScripture').onclick=()=>toggleScripture(current());updateScripture();let b=$('#deeper');b.onclick=()=>{let e=$('#deepText'),open=e.classList.toggle('hidden')===false;b.setAttribute('aria-expanded',String(open));b.textContent=open?'Close ↑':'Go Deeper ↓';let close=$('#closeDeeperBottom');if(close)close.onclick=e=>{e.preventDefault();e.target.closest('#deepText').classList.add('hidden');b.setAttribute('aria-expanded','false');b.textContent='Go Deeper ↓';b.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});b.focus({preventScroll:true})}};let deeperAudio=$('#deeperListen');if(deeperAudio)deeperAudio.onclick=()=>{if(window.WHDCAudio?.play('deeper',deeperAudio))return;if(!('speechSynthesis' in window)){alert('Audio reading is not supported in this browser.');return}if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();document.querySelectorAll('#listen,#scriptureListen,#deeperListen').forEach(el=>{el.textContent=el.id==='listen'?'▶ Listen':el.id==='scriptureListen'?'▶ Listen to Scripture':'▶ Listen to Go Deeper'});return}let d=current();if(!d||!d.deeper)return;let u=makeNarration('Go Deeper. '+d.deeper);u.onend=u.onerror=()=>{let b=$('#deeperListen');if(b)b.textContent='▶ Listen to Go Deeper'};speechSynthesis.speak(u);deeperAudio.textContent='■ Stop audio'};let reflectionButton=$('#reflectionToggle');if(reflectionButton){reflectionButton.onclick=()=>{let e=$('#reflectionText'),open=!e.classList.toggle('hidden');reflectionButton.setAttribute('aria-expanded',String(open));reflectionButton.textContent=open?'Close ↑':'Questions for Reflection ↓'};let reflectionClose=$('#closeReflectionBottom');if(reflectionClose)reflectionClose.onclick=e=>{e.preventDefault();$('#reflectionText').classList.add('hidden');reflectionButton.setAttribute('aria-expanded','false');reflectionButton.textContent='Questions for Reflection ↓';reflectionButton.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});reflectionButton.focus({preventScroll:true})}};$('#markRead').onclick=()=>{if(activeReadingPlan){if(readDate(current().id))planManualUnreadThisSession.add(activeReadingPlan+'::'+current().id);afterPlanReadingMarked(current().id)}else{toggleRead(current().id);syncPlanCompletions();render()}};$('#favorite').onclick=()=>{let f=favs();f=f.includes(currentId)?f.filter(x=>x!==currentId):[...f,currentId];saveFavs(f);render()};$('#shareDevotional').onclick=()=>shareDevotional(current());wireVoiceSettings();const loadedDevotionalId=current().id;window.WHDCAudio?.load(loadedDevotionalId).then(()=>{if(current()?.id!==loadedDevotionalId||!$('#voiceChoice'))return;window.WHDCAudio?.decorate();const voices=devotionalRecordedVoices(),select=$('#voiceChoice');const preferred=preferredAIVoice(),active=selectedReadingVoice();const chosen=voices.includes(active.slice(9))&&active.startsWith('recorded:')?active.slice(9):voices.includes(preferred)?preferred:voices.includes('sulafat')?'sulafat':voices[0];const temp=document.createElement('div');temp.innerHTML=voiceSettings('',voices);const replacement=temp.querySelector('select');select.replaceChildren(...Array.from(replacement.options).map(o=>o.cloneNode(true)));if(voices.length){select.value='recorded:'+chosen;localStorage.setItem(VOICE_KEY,'recorded:'+chosen)}else{select.value=localStorage.getItem(DEVICE_VOICE_KEY)||'';}});$('#listen').onclick=()=>{if(window.WHDCAudio?.play('devotional',$('#listen')))return;if(!('speechSynthesis' in window)){alert('Audio reading is not supported in this browser.');return}const button=$('#listen');if(speechSynthesis.speaking){speechSynthesis.cancel();button.textContent='▶ Listen';return}const spoken=current();if(!spoken)return;const utterance=makeNarration([spoken.title,spoken.reference,spoken.short].join('. '));utterance.onend=()=>{const el=$('#listen');if(el)el.textContent='▶ Listen'};utterance.onerror=()=>{const el=$('#listen');if(el)el.textContent='▶ Listen'};speechSynthesis.speak(utterance);button.textContent='■ Stop audio'};}if(view==='admin')wireAdmin()}
window.addEventListener('popstate',()=>{window.dispatchEvent(new Event('hashchange'))});window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);const match=/^devotional\/(.+)$/.exec(next);if(match){let id='';try{id=decodeURIComponent(match[1])}catch{}if(data.some(d=>d.id===id)){currentId=id;view='today';sessionStorage.setItem(OPEN_DEVOTIONAL_KEY,id);render();return}}if(['home','today','explore','topics','saved','history','plans','milestones','plan-detail','support','contact','settings'].includes(next)){clearOpenDevotional();view=next;if(next==='today')currentId=dailyPick(data)?.id;render()}});function wireAdmin(){$('#new').onclick=()=>showEditor(null);document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>showEditor(data.find(d=>d.id===b.dataset.edit)));$('#export').onclick=()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='content.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};$('#import').onchange=async e=>{let file=e.target.files[0];if(!file)return;try{let imported=JSON.parse(await file.text());validate(imported);if(confirm('Replace all local devotionals with this imported file?')){data=imported;localStorage.setItem(KEY,JSON.stringify(data));render()}}catch(err){alert('Could not import: '+err.message)}}}
function validate(items){if(!Array.isArray(items)||items.some(d=>!d||typeof d.id!=='string'||typeof d.title!=='string'||!Number.isFinite(Number(d.day))||!Array.isArray(d.topics)||typeof d.short!=='string'||typeof d.deeper!=='string'||typeof d.reference!=='string'||typeof d.bibleUrl!=='string'||!/^https:\/\//.test(d.bibleUrl)))throw Error('File must contain an array of complete devotionals with HTTPS Bible URLs.');if(new Set(items.map(d=>d.id)).size!==items.length)throw Error('Duplicate IDs found')}
function showEditor(d){editingId=d?.id||null;$('#editor').innerHTML=form(d);$('#editor').scrollIntoView({behavior:'smooth'});$('#cancel').onclick=()=>$('#editor').innerHTML='';$('#preview').onclick=()=>{const preview={title:$('#title').value,reference:$('#reference').value,short:$('#short').value,deeper:$('#long').value};let existing=$('#draftPreview');if(existing)existing.remove();let node=document.createElement('section');node.id='draftPreview';node.className='card';node.innerHTML='<h2>Reader preview</h2><h3>'+safe(preview.title)+'</h3><p class="scripture">'+safe(preview.reference)+'</p>'+para(preview.short)+'<h3>Go Deeper</h3>'+para(preview.deeper);$('#write').append(node);node.scrollIntoView({behavior:'smooth'})};if(d)$('#delete').onclick=()=>{if(confirm('Delete this devotional from your local draft library?')){data=data.filter(x=>x.id!==d.id);localStorage.setItem(KEY,JSON.stringify(data));render()}};$('#write').onsubmit=e=>{e.preventDefault();let title=$('#title').value.trim(),id=editingId||('devotional-'+Date.now()),item={id,title,day:Number($('#day').value),topics:$('#topicsField').value.split(',').map(x=>x.trim()).filter(Boolean),reference:$('#reference').value.trim(),bibleUrl:$('#bibleUrl').value.trim(),short:$('#short').value.trim(),deeper:$('#long').value.trim()};if(!/^https:\/\//.test(item.bibleUrl)){alert('Use a full HTTPS Bible passage URL.');return}data=editingId?data.map(x=>x.id===editingId?item:x):[...data,item];localStorage.setItem(KEY,JSON.stringify(data));render();alert('Saved in this browser. Export JSON to back up or publish.')}}
async function start(){if(new URLSearchParams(location.search).has('whdcPreview')){
 document.body.classList.add('whdc-published-preview');
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.data?.type!=='whdc-preview-devotional')return;
  const d=event.data.devotional;
  if(!d||typeof d!=='object')return;
  data=[{...d,id:d.id||'preview-only',day:Number(d.day)||1,topics:Array.isArray(d.topics)?d.topics:[]}];
  currentId=data[0].id;view='today';scriptureOpen=false;scriptureForId=null;
  render();
  // The preview uses the actual reader and opens the same in-context Scripture panel.
  // Scripture is retrieved from WHDC's own WEBU endpoint, even for unsaved drafts.
  if((d.contextReferences||d.reference||'').trim())toggleScripture(data[0]);
 });
 parent.postMessage({type:'whdc-preview-ready'},location.origin);
 return;
}try{
 let savedOffline=null;
 try{savedOffline=JSON.parse(localStorage.getItem(WHDC_OFFLINE_KEY)||'null');if(savedOffline)validate(savedOffline)}catch{savedOffline=null}
 if(!navigator.onLine&&savedOffline){data=savedOffline}
 else{
  try{let response=await fetch('content.json');if(!response.ok)throw Error('Content not found');let initial=await response.json();validate(initial);data=initial}
  catch(err){if(savedOffline)data=savedOffline;else throw err}
  try{const live=await fetch('/api/devotionals',{cache:'no-store'});if(live.ok){const items=await live.json();if(Array.isArray(items)&&items.length){validate(items);data=items}}else if(savedOffline)data=savedOffline}
  catch{if(savedOffline)data=savedOffline}
 }
 validate(data)
 loadCustomReadingPlans();
 }catch(err){$('#app').innerHTML='<main class="wrap"><h1>Unable to load devotionals</h1><p>Open this app through a web server rather than opening index.html directly. See README.md.</p></main>';return}if(!localStorage.getItem(APPEARANCE_KEY)&&localStorage.getItem('whdc-dark')==='1')localStorage.setItem(APPEARANCE_KEY,'dark');if(!localStorage.getItem(READING_SIZE_KEY)&&localStorage.getItem('whdc-large')==='1')localStorage.setItem(READING_SIZE_KEY,'120');applyReadingPreferences();const visited=localStorage.getItem(VISITED_KEY)==='1';const hash=location.hash.slice(1);const saved=localStorage.getItem(START_PAGE_KEY);const valid=['home','today','explore','topics','saved','history','plans','plan-detail','support','contact','settings'];const openMatch=/^devotional\/(.+)$/.exec(hash);let restoredId=null;if(openMatch){try{const id=decodeURIComponent(openMatch[1]);if(data.some(d=>d.id===id))restoredId=id}catch{}}view=restoredId?'today':valid.includes(hash)?hash:'today';currentId=restoredId||dailyPick(data)?.id;if(openMatch&&!restoredId)history.replaceState(null,'','#'+view);displayedPickDate=pickDate();render();checkNewAnnouncementOnArrival();if(visited)welcomeOpeningChoice();localStorage.setItem(VISITED_KEY,'1')}start().then(()=>loadCustomReadingPlans());

// Cache only the public reading app shell; admin and role APIs are never cached.
if('serviceWorker' in navigator&&location.protocol==='https:'){
 window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(console.warn));
}

// Keep the displayed selection in sync even when the app stays open overnight.
setInterval(()=>{if(data.length)refreshDailyPick()},60000);

// Devotional selections use Save Quote only; Bible Reader study tools remain separate.

// Inductive paragraph notes (shared with Bible Reader).
if(!document.querySelector('script[src^="/bible/study-notes.js"]')){const script=document.createElement('script');script.src='/bible/study-notes.js?v=1';script.defer=true;document.body.append(script)}
