// Add your payment links here when ready. Leave blank to display a coming-soon message.
const SUPPORT_VENMO_URL='https://venmo.com/u/whenhealingdoesntcome';
const SUPPORT_SQUARE_URL='';
const DEVOTIONAL_OUTLINE={"Identity":["Who Am I?","I Am Chosen","I Am Loved","I Am Adopted","I Am Known","I Am a Saint","I Am Beautiful","I Am Enough","I Am Not My Own","I Am Not Alone","I Am Not My Social Media","Jehovah Tsidkenu - The Lord Our Righteousness"],"Rest":["What is Rest?","I’m Tired of Resting","Am I Lazy?","Rest for the Soul","Limitations","Using My Limitations for Good","Being a Mary","Sabbath","The Art of Listening","Apart from Me, You Can Do Nothing","Producing Fruit","Jehovah Jireh - The Lord Will Provide"],"Anxiety":["How Long Oh Lord?","How Am I Going to Pay My Bills?","What if I Never Get Better?","What if…","Am I Faking?","Dying","What About My Dreams?","When Sin Runs Deep","Filled with Truth","Rejecting the Lies","Can You Hear Me?","Jehovah Nissi - The Lord My Banner"],"Peace":["I Need Peace","Calming the Storm","Beyond My Understanding","God’s History","My History","Peace Like a River","God is My Vine","Abiding","Drowning Out the Noise","What is Peace?","Asleep on the Boat","Jehovah Shalom - The Lord Is Peace"],"Loneliness":["Where are My Friends?","Where is God?","Nobody Understands","The Hidden Sickness","Hearing God’s Voice","Uninvited","Held","Quietness","Alone","Help!","Faithful","Jehovah Shammah - The Lord Is There"],"Community":["I Have Today","The Little Things","The Next Thing","Living in my Limitations","Building God’s Kingdom","The Church","When the Church is Broken","All We Need is Jesus","Gentleness","Better Together","Dumb Sheep","Jehovah Raah - The Lord My Shepherd"],"Depression":["Why Are You Downcast, O My Soul","Light in the Darkness","When I Can’t See","The Valley of the Shadow of Death","Broken-hearted","The Mountain Top","Lost in the Depths","Storm Clouds","No More Tears","Silence","Deer in the Headlights","El Roi - The Lord Who Sees"],"Praise":["When no Fruit in on the Vine","Worship is my weapon","Sing His Praise","Sunrise","Sunset","Mountains","Perspective","Bigger Than","Seasons","All Creation Sings His Praise","Sacrifice of Praise","El Elyon - The God Most High"],"Frustration":["How long?","Why Me?","Why Now?","I Have Things I Want to Do","I Have Things I Need to Do","How Does This Help the Kingdom?","Not By My Strength","Not Again!","Set Back","Every New Battle","Shallow","El Deah - The God of Knowledge"],"Contentment":["Godliness with Contentment","Paul","I Can Do All Things","Every Good and Perfect Gift","He Knows","Sacrifice","It is Well With My Soul","His Bank Account","Work in Progress","All My Plans","Count It As Loss","Jehovah Mekoddishkem - The Lord Who Sanctifies You"],"Fear":["When I Am Afraid","Fear of Man","Fear of God","Fear of Evil","Faith over Fear","Fear of Sickness","Fear of Death","Fear of Sin","Knowing the Enemy","Armor of God","Battle Belongs to the Lord","Jehovah Tsuri - The Lord Our Rock"],"Joy":["Joy vs Happiness","Joy Made Full","Where is Joy?","Lamentations","Made for More","Repentance","Joy of the Lord is My Strength","I Lift My Eyes Up","The Joy Set Before Him","Filled to Overflowing","Joy Comes in the Morning","Jehovah Elohim - The Lord the Creator"],"Grief":["Denial","Loss of Independence","Loss of Ability","Loss of Security","Loss of Community","Loss of Capacity","Anger","Acceptance","Can I Go On?","Empty","Weeping","El Gibhor - The Mighty God"],"Hope":["Living for Eternity","Living in the Present","Living in Light of the Past","Hope Comes Down","Heaven","Heart Made Whole","Working All Things Together for Good","Holy, Holy, Holy","Press On","Hope Does Not Disappoint","Why Hope?","Jehovah Ma’on - The Lord Our Dwelling Place"],"Suffering":["Pain","Sorrow","Loss","Weakness","Overcoming","Never Wasted","God is Always Good…","But It Doesn’t Always Feel That Way","Job","Like Gold","Endurance","Abba - Daddy"],"Surrender":["Surrender vs Obedience","Surrender Feels Scary","Knowing God","Trusting God","Full Surrender","Like a River","The Straw","Yield","A Heart Like His","Take Me Deeper","God’s Will","Adonai - Lord, Master"],"Waiting":["What is Waiting?","Why Wait?","Waiting is an Art","Joy in the Waiting","Patience is a Virtue","Still?","Tired.","A Light for Each Step","Merging","This Moment","Treasures of Darkness","Alpha and Omega - The Beginning and The End"],"Healing":["Why Sickness and Pain?","Praying in Faith","Why Won’t You Heal Me?","Touching the Hem","I Believe, Help My Unbelief","Healing Will Come…","But It Might Not Be Today","This Light and Momentary Affliction","It Doesn’t Feel Light","It Doesn’t Feel Momentary","Glory to Glory","Jehovah Rapha - The Lord That Heals"],"Purpose":["Why Am I Here?","Purposes of God","Made on Purpose for a Purpose","Purpose in Suffering","Mindfulness","Living Sacrifice","Discipline is Good","Loving God with all My Strength","Loving God with all My Heart","Loving God with all My Mind","Loving God with all My Soul","El Chuwl - The God who Gave You Birth"],"Living with Limits":["Planning","Interruptible","Bad Days","Good Days","The Inbetween","Pushing Myself","One Step","Thankful for the Little Things","Thankfulness as a Lifestyle","Mind Control","El Chay - Living God"],"Working through Chronic Illness":["Fallen World","Unrepentant Sin","Bitterness","Demonic","Unhealthy Habits","Test of Faith","Glory of God","Our Body Is a Temple","Protecting Our Minds","Desert Places","Overwhelmed","Attiyq Youm - Ancient of Days"]};
const $=s=>document.querySelector(s);const KEY='whdc-drafts-v1',FAV='whdc-favorites-v1';let scriptureRef='',scriptureURL='',scriptureLoading=false,scriptureData=null,scriptureError='',scriptureForId=null,scriptureOpen=false;let data=[],view='home',selectedTopic='All',currentId=null,editingId=null;const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const formatInline=s=>safe(s).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>');const para=s=>String(s||'').split(/\n\s*\n/).map(x=>`<p>${formatInline(x).replace(/\n/g,'<br>')}</p>`).join('');const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};const READ_KEY='whdc-read-history-v1';
// The selected devotional survives reloads in this tab, but not a new browsing session.
const OPEN_DEVOTIONAL_KEY='whdc-open-devotional-tab-v1';
const TOPIC_SESSION_KEY='whdc-topic-reading-session-v1';
const selectedTopicReading=()=>{try{return sessionStorage.getItem(TOPIC_SESSION_KEY)||''}catch{return ''}};
function setTopicReading(id){try{sessionStorage.setItem(TOPIC_SESSION_KEY,String(id))}catch{}}
function syncTopicReadingNav(){const isTopic=view==='today'&&selectedTopicReading()===currentId;window.WHDCNav?.bottomNav(isTopic?'read':view==='topics'?'explore':view,true)}
function closeTopicReading(){sessionStorage.removeItem(TOPIC_SESSION_KEY);sessionStorage.removeItem(OPEN_DEVOTIONAL_KEY);currentId=dailyPick(data)?.id;view='explore';history.pushState(null,'','#explore');render();window.scrollTo(0,0)}
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
const openingPage=()=>{const saved=localStorage.getItem(START_PAGE_KEY);return ['home','today','bible','explore'].includes(saved)?saved:'today'};
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

function collapsedSettings(html){
 const titles=['Opening page','Customize Navigation Bar','Reading &amp; Appearance','Accessibility','Audio Reading','Offline Reading','Notifications'];
 for(const title of titles){
  const heading='<h2>'+title+'</h2>',pos=html.indexOf(heading);if(pos<0)continue;
  const sectionStart=html.lastIndexOf('<section',pos),next=html.indexOf('</section>',pos);if(sectionStart<0||next<0)continue;
  const end=next+'</section>'.length;
  const section=html.slice(sectionStart,end).replace(heading,'');
  html=html.slice(0,sectionStart)+`<details class="whdc-settings-collapsible"><summary>${title.replace(/&amp;/g,'&')}</summary>${section}</details>`+html.slice(end);
 }
 return `<style>.whdc-settings-collapsible{max-width:760px;margin:0 auto 12px;border:1px solid var(--border,#d0d4d1);border-radius:12px;overflow:hidden}.whdc-settings-collapsible>summary{cursor:pointer;padding:16px;font-weight:700;list-style-position:inside}.whdc-settings-collapsible[open]>summary{border-bottom:1px solid var(--border,#d0d4d1)}.whdc-settings-collapsible>.card{border:0!important;margin:0!important;max-width:none!important;border-radius:0!important}.whdc-reminder-details>summary{cursor:pointer;padding:8px 0}.whdc-settings-collapsible>summary:focus-visible{outline:2px solid currentColor}#bottomNavChoices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 10px;width:100%;min-width:0}#bottomNavChoices .whdc-nav-choice{display:flex;align-items:center;gap:7px;min-width:0;max-width:100%;box-sizing:border-box;padding:6px 3px;font-size:13px;line-height:1.25;overflow-wrap:anywhere;cursor:pointer}#bottomNavChoices .whdc-nav-choice input[type=checkbox]{appearance:auto!important;-webkit-appearance:checkbox!important;display:inline-block!important;position:static!important;flex:0 0 16px!important;width:16px!important;height:16px!important;min-width:16px!important;min-height:16px!important;max-width:16px!important;max-height:16px!important;margin:0!important;padding:0!important;transform:none!important;accent-color:#6c8b83}#bottomNavChoices .whdc-nav-choice span{min-width:0;overflow-wrap:anywhere}@media(max-width:370px){#bottomNavChoices{grid-template-columns:minmax(0,1fr)}}.whdc-settings-collapsible>.card{box-sizing:border-box;width:100%;min-width:0}</style>`+html;
}
function bottomNavigationSettings(){
 const selected=window.WHDCNav?.selectedTabs?.()||['home','today','bible','explore'];
 const pages=(window.WHDCNav?.customTabs||[]).filter(p=>p.id!=='support'&&p.id!=='contact');
 return `<section class="card" style="max-width:760px;margin:0 auto 2rem"><h2>Customize Navigation Bar</h2><p class="muted small">Choose up to four pages for your mobile bottom bar. Settings always stays in the fifth position. Your choices save automatically on this device.</p><div id="bottomNavChoices">${pages.map(p=>`<label class="whdc-nav-choice"><input type="checkbox" name="bottomNavPage" value="${p.id}" ${selected.includes(p.id)?'checked':''}><span>${p.label}</span></label>`).join('')}</div><p id="bottomNavStatus" class="muted small" role="status">${selected.length} of 4 pages selected.</p><p class="muted small">Settings is always visible and cannot be removed.</p></section>`;
}
function wireBottomNavigationSettings(){
 const inputs=[...document.querySelectorAll('input[name="bottomNavPage"]')];
 const status=document.getElementById('bottomNavStatus');
 inputs.forEach(input=>input.addEventListener('change',()=>{
   const ids=inputs.filter(x=>x.checked).map(x=>x.value);
   if(ids.length>4||ids.length<1){input.checked=!input.checked;status.textContent=ids.length>4?'Choose no more than four pages.':'Keep at least one page selected.';return}
   window.WHDCNav?.setTabs?.(ids);
   status.textContent=`Saved. ${ids.length} of 4 pages selected.`;
 }));
}
function notificationSettings(){
 const days=(name)=>`<div class="whdc-reminder-days">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i)=>`<label class="whdc-reminder-day"><input type="checkbox" name="${name}" value="${i}" checked><span>${d}</span></label>`).join('')}</div>`;
 return `<section class="card whdc-notifications" style="max-width:760px;margin:0 auto 2rem"><h2>Notifications</h2><div class="whdc-settings-content"><p class="muted small">Optional reminders and What's New announcements. On iPhone, add WHDC to your Home Screen first.</p><p id="pushStatus" role="status" aria-live="polite">Checking notification support…</p><div class="whdc-notification-toggle" style="display:flex;flex-direction:column;align-items:flex-start;gap:8px"><button type="button" class="btn" id="pushEnable">Enable notifications on this device</button><button type="button" class="btn" id="pushDisable" hidden style="display:none">Turn off notifications on this device</button></div><div class="whdc-notification-prefs" style="margin-top:16px">
 <label class="whdc-notification-choice"><input type="checkbox" id="pushNews"> What's New notifications</label><p class="muted small" style="margin:3px 0 16px 24px">Announcements are sent immediately between 8 AM and 9 PM in your local time. Announcements published outside these hours are sent at 8 AM.</p>
 <label class="whdc-notification-choice"><input type="checkbox" id="pushPlans"> Reading Plan notifications</label><details class="whdc-reminder-details" style="margin:6px 0 16px 24px"><summary>Reading plan reminder schedule</summary><div style="padding-top:12px"><label for="pushPlanTime">Reminder time</label><input type="time" id="pushPlanTime" value="08:00" class="whdc-reminder-time" style="font:inherit;min-height:44px"><p class="muted small">Days to remind me:</p>${days('pushPlanDay')}</div></details>
 <label class="whdc-notification-choice"><input type="checkbox" id="pushMemory"> Scripture memory reminders</label><details class="whdc-reminder-details" style="margin:6px 0 16px 24px"><summary>Scripture memory reminder schedule</summary><div style="padding-top:12px"><label for="pushMemoryTime">Reminder time</label><input type="time" id="pushMemoryTime" value="08:00" style="font:inherit;min-height:44px"><p class="muted small">Days to remind me:</p>${days('pushMemoryDay')}</div></details>
 <label class="whdc-notification-choice"><input type="checkbox" id="pushReminders"> Daily devotional reminders</label><details class="whdc-reminder-details" style="margin:6px 0 16px 24px"><summary>Daily devotional reminder schedule</summary><div style="padding-top:12px"><label for="pushTime">Reminder time</label><input type="time" id="pushTime" value="08:00" class="whdc-reminder-time" style="font:inherit;min-height:44px"><p class="muted small">Days to remind me:</p>${days('pushDay')}</div></details></div><p class="muted small" id="pushAutosaveStatus" role="status">Changes are saved automatically on this device.</p></div></section>`;
}
// Shared lightweight reminder dialog for Favorite Verses and new reading plans.
function openWHDCReminderPopup(kind,onClose){
 document.getElementById('whdcReminderOverlay')?.remove();
 const isPlan=kind==='plan',key='whdc-push-preferences-v2',draft=(()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}})();
 const timeKey=isPlan?'plan_reminder_local_time':'memory_reminder_local_time',daysKey=isPlan?'plan_reminder_days':'memory_reminder_days',enabledKey=isPlan?'plan_reminders_requested':'memory_reminders_enabled';
 const old=document.activeElement,overlay=document.createElement('div');overlay.id='whdcReminderOverlay';overlay.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:12px';
 const days=Array.isArray(draft[daysKey])?draft[daysKey]:[0,1,2,3,4,5,6];
 overlay.innerHTML=`<section role="dialog" aria-modal="true" aria-labelledby="whdcReminderTitle" style="width:min(100%,360px);max-height:calc(100dvh - 24px);overflow:auto;background:var(--card,var(--surface,#fff));color:var(--text,inherit);border:1px solid var(--border,#bbb);border-radius:14px;padding:16px;box-shadow:0 12px 40px #0004"><h2 id="whdcReminderTitle">${isPlan?'Reading Plan Reminder':'Scripture Memory Reminder'}</h2><p>${isPlan?'Would you like a reminder to continue your reading plan?':'Choose when you would like to practice your saved verses.'}</p><div id="whdcReminderChoice" ${isPlan?'':'hidden'} style="display:${isPlan?'flex':'none'};gap:10px;flex-wrap:wrap;margin-top:14px"><button type="button" class="btn primary" id="whdcPopupYes">Yes</button><button type="button" class="btn" id="whdcPopupNo">No</button></div><div id="whdcReminderFields" ${isPlan?'hidden':''}><label for="whdcPopupTime">Reminder time</label><input id="whdcPopupTime" type="time" value="${draft[timeKey]||'08:00'}" style="display:block;margin:8px 0 12px;min-height:44px;font:inherit"><p style="margin:8px 0">Reminder days</p><div style="display:flex;flex-wrap:wrap;gap:7px 10px;font-size:13px">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i)=>`<label><input type="checkbox" name="whdcPopupDay" value="${i}" ${days.includes(i)?'checked':''}> ${d}</label>`).join('')}</div></div><p id="whdcPopupStatus" role="status" class="muted small"></p><div class="actions" id="whdcPopupActions" style="margin-top:14px;display:${isPlan?'none':'flex'}" ${isPlan?'hidden':''}><button class="btn primary" id="whdcPopupSave" type="button">Save Settings</button><button class="btn" id="whdcPopupCancel" type="button">Cancel</button></div></section>`;
 document.body.appendChild(overlay);const close=()=>{overlay.remove();old?.focus?.();onClose?.()};
 overlay.querySelector('#whdcPopupCancel').onclick=close;
 if(isPlan){overlay.querySelector('#whdcPopupNo').onclick=close;overlay.querySelector('#whdcPopupYes').onclick=()=>{overlay.querySelector('#whdcReminderChoice').hidden=true;overlay.querySelector('#whdcReminderChoice').style.display='none';overlay.querySelector('#whdcReminderFields').hidden=false;overlay.querySelector('#whdcPopupActions').hidden=false;overlay.querySelector('#whdcPopupActions').style.display='flex';};}
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 overlay.querySelector('#whdcPopupSave').onclick=async()=>{
  const button=overlay.querySelector('#whdcPopupSave'),status=overlay.querySelector('#whdcPopupStatus');button.disabled=true;
  const next={...draft,[enabledKey]:true,[timeKey]:overlay.querySelector('#whdcPopupTime').value,[daysKey]:[...overlay.querySelectorAll('input[name="whdcPopupDay"]:checked')].map(x=>Number(x.value))};
  if(!next[timeKey]||!next[daysKey].length){status.textContent='Select a time and at least one day.';button.disabled=false;return}
  if(isPlan)next.plan_reminders_enabled=true;
  localStorage.setItem(key,JSON.stringify(next));
  try{
   if(!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window))throw Error('Push notifications are unavailable on this device. Your choices are saved locally.');
   const reg=await navigator.serviceWorker.ready,sub=await reg.pushManager.getSubscription();
   if(!sub)throw Error('Your choices are saved. Enable notifications in Settings to receive reminders.');
   const r=await fetch('/api/push/preferences?endpoint='+encodeURIComponent(sub.endpoint),{cache:'no-store'}),data=await r.json();
   const prefs={...(data.preferences||{}),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone};
   prefs[isPlan?'plan_reminders_enabled':'memory_reminders_enabled']=true;prefs[timeKey]=next[timeKey];prefs[daysKey]=next[daysKey];
   const result=await fetch('/api/push/subscribe',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify({subscription:sub.toJSON(),preferences:prefs})});
   if(!result.ok)throw Error('Saved locally, but the notification server could not be updated.');
  }catch(e){console.warn('Reminder preference:',e.message);alert(e.message)}
  close();
 };
 if(isPlan)overlay.querySelector('#whdcPopupYes').focus();
}
function wireNotificationSettings(){
 const el=id=>document.getElementById(id),status=el('pushStatus'),setStatus=t=>status.textContent=t;
 const supported=()=>('serviceWorker'in navigator&&'PushManager'in window&&'Notification'in window&&window.isSecureContext);
 const showSubscriptionControls=enabled=>{const enable=el('pushEnable'),disable=el('pushDisable');enable.hidden=!!enabled;enable.style.display=enabled?'none':'';disable.hidden=!enabled;disable.style.display=enabled?'':'none'};
 showSubscriptionControls(false);
 const keyBytes=key=>{const base=key.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(base.padEnd(Math.ceil(base.length/4)*4,'=')),c=>c.charCodeAt(0))};
 const registration=()=>navigator.serviceWorker.ready;
 const subscription=async()=>supported()?await(await registration()).pushManager.getSubscription():null;
 const request=async(path,body)=>{const r=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify(body)});const data=await r.json().catch(()=>({}));if(!r.ok)throw Error(data.error||'Request failed');return data};
 const draftKey='whdc-push-preferences-v2';
 const selected=name=>[...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>Number(x.value));
 const preferences=()=>({announcements_enabled:el('pushNews').checked,reminders_enabled:el('pushReminders').checked,reminder_local_time:el('pushTime').value,reminder_days:selected('pushDay'),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,plan_reminders_enabled:el('pushPlans').checked&&planEnrollments().length>0,plan_reminder_local_time:el('pushPlanTime').value,plan_reminder_days:selected('pushPlanDay'),memory_reminders_enabled:el('pushMemory').checked,memory_reminder_local_time:el('pushMemoryTime').value,memory_reminder_days:selected('pushMemoryDay')});
 const apply=p=>{if(!p)return;el('pushNews').checked=!!p.announcements_enabled;el('pushReminders').checked=!!p.reminders_enabled;el('pushPlans').checked=!!p.plan_reminders_enabled;el('pushMemory').checked=!!p.memory_reminders_enabled;el('pushMemoryTime').value=p.memory_reminder_local_time||'08:00';el('pushTime').value=p.reminder_local_time||'08:00';el('pushPlanTime').value=p.plan_reminder_local_time||p.reminder_local_time||'08:00';for(const [name,days] of [['pushDay',p.reminder_days],['pushPlanDay',p.plan_reminder_days||p.reminder_days],['pushMemoryDay',p.memory_reminder_days||[0,1,2,3,4,5,6]]]){if(!Array.isArray(days))continue;document.querySelectorAll(`input[name="${name}"]`).forEach(x=>x.checked=days.includes(Number(x.value)))}};
 const sync=async(sub)=>request('/api/push/subscribe',{subscription:sub.toJSON(),preferences:preferences()});
 try{const draft=JSON.parse(localStorage.getItem(draftKey)||'null');apply(draft);if(draft&&typeof draft.plan_reminders_requested==='boolean')el('pushPlans').checked=draft.plan_reminders_requested}catch{}
 let saveVersion=0;
 const save=async()=>{const version=++saveVersion;const p=preferences();localStorage.setItem(draftKey,JSON.stringify({...p,plan_reminders_requested:el('pushPlans').checked}));el('pushAutosaveStatus').textContent='Saving preferences…';try{const sub=await subscription();if(sub){await sync(sub);if(version===saveVersion)el('pushAutosaveStatus').textContent='Preferences saved automatically.'}else if(version===saveVersion)el('pushAutosaveStatus').textContent='Saved on this device. Enable notifications to receive reminders.'}catch(e){if(version===saveVersion)el('pushAutosaveStatus').textContent='Saved on this device, but could not update notifications: '+e.message}};
 for(const id of ['pushNews','pushPlans','pushReminders','pushTime','pushPlanTime','pushMemory','pushMemoryTime'])el(id).addEventListener('change',save);
 document.querySelectorAll('input[name="pushDay"],input[name="pushPlanDay"],input[name="pushMemoryDay"]').forEach(x=>x.addEventListener('change',save));

 if(!supported()){setStatus('Push notifications are unavailable in this browser. On iPhone, install WHDC to your Home Screen and open it there.');el('pushEnable').disabled=true;return}
 (async()=>{try{const sub=await subscription();if(!sub){setStatus('Notifications are not enabled on this device.');return}const r=await fetch('/api/push/preferences?endpoint='+encodeURIComponent(sub.endpoint),{cache:'no-store'});if(r.ok){const data=await r.json();if(data.preferences){apply(data.preferences);try{const draft=JSON.parse(localStorage.getItem(draftKey)||'null');if(draft&&typeof draft.plan_reminders_requested==='boolean')el('pushPlans').checked=draft.plan_reminders_requested}catch{}}}showSubscriptionControls(true);setStatus('This device is subscribed. Notifications are enabled.')}catch(e){setStatus('Could not check subscription: '+e.message)}})();
 el('pushEnable').onclick=async()=>{try{if(Notification.permission==='denied')throw Error('Notification permission is blocked in device settings.');const permission=await Notification.requestPermission();if(permission!=='granted'){setStatus('Notification permission was not granted.');return}const key=await fetch('/api/push/public-key',{cache:'no-store'}).then(r=>r.json());if(!key.publicKey)throw Error('Public push key is not configured.');const reg=await registration();const sub=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(key.publicKey)});await sync(sub);showSubscriptionControls(true);setStatus('Notifications enabled. Your preferences are saved.')}catch(e){setStatus('Could not enable notifications: '+e.message)}};
 el('pushDisable').onclick=async()=>{try{const sub=await subscription();if(sub){await request('/api/push/unsubscribe',{endpoint:sub.endpoint});await sub.unsubscribe()}showSubscriptionControls(false);setStatus('Notifications turned off on this device.')}catch(e){setStatus('Could not turn off notifications: '+e.message)}};
}
async function syncReadingPlanPush(){
 try{if(!('serviceWorker'in navigator)||!('PushManager'in window))return;const reg=await navigator.serviceWorker.ready;const sub=await reg.pushManager.getSubscription();if(!sub)return;
 const current=await fetch('/api/push/preferences?endpoint='+encodeURIComponent(sub.endpoint),{cache:'no-store'}).then(r=>r.json());const p=current.preferences;if(!p)return;
 const saved=JSON.parse(localStorage.getItem('whdc-push-preferences-v2')||'{}');p.plan_reminders_enabled=!!saved.plan_reminders_requested&&planEnrollments().length>0;
 await fetch('/api/push/subscribe',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify({subscription:sub.toJSON(),preferences:p})});
 }catch(e){console.warn('Reading plan reminder sync failed',e)}
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
 return `<article class="card"><div class="eyebrow">${safe(new Date(e.createdAt).toLocaleDateString())}</div><h3>${safe(e.title)}</h3><p style="white-space:pre-wrap;overflow-wrap:anywhere">${safe(e.text)}</p>${e.type==='prayer'?`<label class="whdc-answered-toggle"><input type="checkbox" data-journal-answered="${safe(e.id)}" ${e.answered?'checked':''} aria-label="Prayer answered: ${safe(e.title)}"> <span>Answered</span></label>`:''}${d?`<p class="muted small">Devotional: ${safe(d.title)}</p>`:''}<div class="actions whdc-compact-actions"><button type="button" class="btn" data-journal-edit="${safe(e.id)}" aria-label="Edit journal entry">${compactAction('edit','Edit','Edit')}</button><button type="button" class="btn" data-journal-delete="${safe(e.id)}" aria-label="Delete journal entry">${compactAction('delete','Delete','Delete')}</button>${d?`<button type="button" class="btn" data-journal-open="${safe(d.id)}" aria-label="Open devotional">${compactAction('open','Open devotional','Open')}</button>`:''}</div></article>`;
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
function addJournalLayoutStyles(){if(document.getElementById('whdc-journal-layout-style'))return;const st=document.createElement('style');st.id='whdc-journal-layout-style';st.textContent=`.whdc-journal-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:20px 0}.whdc-journal-tile{min-width:0;border:1px solid var(--line,#d7dce0);border-radius:15px;background:var(--card,var(--surface,#fff));overflow:hidden}.whdc-journal-tile>summary{list-style:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;text-align:center;min-height:135px;padding:14px;position:relative;box-sizing:border-box}.whdc-journal-tile>summary::-webkit-details-marker{display:none}.whdc-journal-tile-icon{display:flex;align-items:center;justify-content:center;color:var(--ink,var(--text,currentColor))}.whdc-journal-tile>summary strong{font-size:1rem;line-height:1.3}.whdc-journal-tile>summary small{opacity:.7}.whdc-journal-tile-chevron{position:absolute;right:11px;top:8px;font-size:20px;opacity:.7}.whdc-journal-tile[open] .whdc-journal-tile-chevron{transform:rotate(180deg)}.whdc-journal-tile[open]{grid-column:1/-1}.whdc-journal-tile-content{border-top:1px solid var(--line,#d7dce0);padding:16px;min-width:0}.whdc-journal-tile>summary:focus-visible{outline:2px solid currentColor;outline-offset:-4px}@media(min-width:760px){.whdc-journal-tiles{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:420px){.whdc-journal-tile>summary{min-height:120px;padding:12px}.whdc-journal-tile>summary strong{font-size:.9rem}}.whdc-journal-section details>summary{cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;list-style:none}.whdc-journal-section details>summary::-webkit-details-marker{display:none}.whdc-journal-section details>summary:after{content:'⌄';font-size:24px;line-height:1}.whdc-journal-section details[open]>summary:after{content:'⌃'}.whdc-journal-section summary h2{margin:0}.whdc-journal-inner{padding-top:16px}.whdc-journal-list{margin-top:14px}.whdc-answered-toggle{display:inline-flex!important;align-items:center;gap:6px;max-width:100%;width:max-content;font-size:13px;line-height:1.3;white-space:nowrap;margin:8px 0 12px;cursor:pointer}.whdc-answered-toggle input{width:15px!important;height:15px!important;flex:0 0 15px;margin:0!important;min-width:0!important}.whdc-journal-modal[hidden]{display:none!important}.whdc-journal-modal{position:fixed;inset:0;z-index:10050;background:rgba(18,26,29,.58);display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box}.whdc-journal-dialog{width:min(100%,480px);max-height:calc(100dvh - 28px);overflow:auto;box-sizing:border-box;margin:0}.whdc-journal-dialog-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.whdc-journal-dialog-head h2{margin:0}.whdc-journal-modal-open{overflow:hidden}@media(max-width:700px){.whdc-journal-dialog{padding:16px}.whdc-journal-section .card{min-width:0}.whdc-answered-toggle{font-size:12px}}.whdc-journal-tiles .whdc-journal-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;text-align:center;min-height:125px;padding:14px;color:inherit;font:inherit;cursor:pointer;box-sizing:border-box;width:100%}.whdc-journal-tiles .whdc-journal-tile.is-active{border-color:var(--accent,#788f9b);box-shadow:0 0 0 1px var(--accent,#788f9b)}.whdc-journal-panels>.whdc-journal-tile-content{border:1px solid var(--line,#d7dce0);border-radius:15px;background:var(--card,var(--surface,#fff));margin:0 0 20px;padding:18px}.whdc-journal-panels>.whdc-journal-tile-content[hidden]{display:none!important}.whdc-journal-panel-title{margin:0 0 16px;font-size:1.35rem;line-height:1.3}.whdc-journal-tiles .whdc-journal-tile:focus-visible{outline:2px solid currentColor;outline-offset:3px}`;document.head.appendChild(st)}
function journalTileIcon(type){
 const paths={
  prayer:'<path d="M8.5 3.5 12 9l3.5-5.5M8.5 3.5c-1.5 1.5-1.6 3.5-.5 5L12 13l4-4.5c1.1-1.5 1-3.5-.5-5M12 13v7M8 20h8"/><path d="M6.5 10.5 9 13m8.5-2.5L15 13"/>',
  reflection:'<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-2-.7-4.3-.7-6.5.2"/><path d="m14 11 5-5 2 2-5 5-3 1 1-3Z"/><path d="M6 9h3M6 12h3"/>',
  quotes:'<path d="M10 7H5v6h4l-2 4M20 7h-5v6h4l-2 4"/>',
  verses:'<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/><path d="m15 9 1.5 1.5L19 8"/>'
 };
 return `<svg viewBox="0 0 24 24" width="29" height="29" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type]||''}</svg>`;
}
function journalTile(id,title,count,type,isOpen){
 return `<button type="button" class="whdc-journal-tile${isOpen?' is-active':''}" id="${id}" data-journal-panel="${id}" aria-controls="${id}Panel" aria-expanded="${isOpen?'true':'false'}"><span class="whdc-journal-tile-icon">${journalTileIcon(type)}</span><strong>${title}</strong><small>${count} saved</small></button>`;
}
function journalPage(){
 addJournalLayoutStyles();
 const entries=journalEntries().filter(e=>`${e.title} ${e.text}`.toLowerCase().includes(journalSearch.toLowerCase())).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
 const prayers=entries.filter(e=>e.type==='prayer'),reflections=entries.filter(e=>e.type==='reflection');
 const openReflections=journalOpenReflections;
 const openSections=new Set(journalExpandedSections);if(openReflections)openSections.add('journalReflections');
 journalOpenReflections=false;
 const journalVerses=favoriteVersesPage().replace(/^<section class="hero">[\s\S]*?<\/section>/,'');
 const journalQuotes=savedQuotesPage().replace(/^<section class="hero">[\s\S]*?<\/section>/,'');
 return `<section class="hero"><div class="eyebrow">Private on this device</div><h1>My Journal</h1><p>Your prayer requests, devotional reflections, saved quotes, and favorite Scripture in one place. Saved content stays on this device unless you export it.</p></section>
 <div class="whdc-journal-tiles" aria-label="Journal collections">
 ${journalTile('journalPrayers','Prayer Requests',prayers.length,'prayer',openSections.has('journalPrayers'))}
 ${journalTile('journalReflections','Devotional Reflections',reflections.length,'reflection',openSections.has('journalReflections'))}
 ${journalTile('journalQuotes','Saved Quotes',savedQuotes().length,'quotes',openSections.has('journalQuotes'))}
 ${journalTile('journalVerses','Favorite Scriptures',favoriteVerses().length,'verses',openSections.has('journalVerses'))}
 </div>
 <div class="whdc-journal-panels">
 <section class="whdc-journal-tile-content" id="journalPrayersPanel" ${!openSections.has('journalPrayers')?'hidden':''}><h2 class="whdc-journal-panel-title">Prayer Requests</h2><button type="button" class="btn" id="journalNewPrayer" aria-label="New prayer request">＋ New</button>${prayers.length?`<div class="grid whdc-journal-list">${prayers.map(journalEntryCard).join('')}</div>`:'<p class="muted">No prayer requests yet.</p>'}</section>
 <section class="whdc-journal-tile-content" id="journalReflectionsPanel" ${!openSections.has('journalReflections')?'hidden':''}><h2 class="whdc-journal-panel-title">Devotional Reflections</h2>${reflections.length?`<div class="grid">${reflections.map(journalEntryCard).join('')}</div>`:'<p class="muted">No devotional reflections found. Open a devotional to write one.</p>'}</section>
 <section class="whdc-journal-tile-content" id="journalQuotesPanel" ${!openSections.has('journalQuotes')?'hidden':''}><h2 class="whdc-journal-panel-title">Saved Quotes</h2>${journalQuotes}</section>
 <section class="whdc-journal-tile-content" id="journalVersesPanel" ${!openSections.has('journalVerses')?'hidden':''}><h2 class="whdc-journal-panel-title">Favorite Scriptures</h2>${journalVerses}</section>
 </div>
 <section class="card whdc-journal-export"><h2>Export Journal</h2><p class="muted small">Export your prayer requests and devotional reflections to keep a private backup. Your journal is stored on this device and can be lost if its app data is cleared.</p><button type="button" class="btn" id="journalExport">Export My Journal</button></section>
 <div class="whdc-journal-modal" id="journalPrayerModal" hidden><div class="whdc-journal-dialog card" role="dialog" aria-modal="true" aria-labelledby="journalEditorTitle"><div class="whdc-journal-dialog-head"><h2 id="journalEditorTitle">Prayer Request</h2><button type="button" class="btn" id="journalClosePrayer" aria-label="Close prayer request form">✕</button></div><form id="journalForm"><input type="hidden" id="journalTitle" value=""><label for="journalText">Your prayer</label><textarea id="journalText" required maxlength="30000" rows="5" placeholder="Write your prayer request here…" style="width:100%;box-sizing:border-box;margin:8px 0 12px;padding:12px"></textarea><label class="whdc-answered-toggle"><input type="checkbox" id="journalAnswered"> <span>Answered</span></label><div class="actions whdc-compact-actions"><button type="submit" class="btn primary" aria-label="Save prayer request">${compactAction('save','Save prayer request','Save')}</button><button type="button" class="btn" id="journalClear" aria-label="New prayer request">${compactAction('new','New prayer request','New')}</button></div><p id="journalStatus" role="status" aria-live="polite"></p></form></div></div>`;
}
let journalOpenReflections=false;
let journalExpandedSections=new Set();
function preserveJournalSections(){if(view!=='journal')journalExpandedSections.clear()}
function openPrayerJournalModal(){
 const modal=document.getElementById('journalPrayerModal');if(!modal)return;
 modal.hidden=false;document.body.classList.add('whdc-journal-modal-open');
 document.getElementById('journalText')?.focus({preventScroll:true});
}
function closePrayerJournalModal(){
 const modal=document.getElementById('journalPrayerModal');if(modal)modal.hidden=true;
 document.body.classList.remove('whdc-journal-modal-open');
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
   openPrayerJournalModal();
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
 document.getElementById('devotionalJournalAll').onclick=()=>{journalOpenReflections=true;nav('journal')};
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
 document.querySelectorAll('[data-journal-panel]').forEach(button=>button.addEventListener('click',()=>{
  const id=button.dataset.journalPanel;
  const alreadyOpen=journalExpandedSections.has(id);
  journalExpandedSections.clear();
  if(!alreadyOpen)journalExpandedSections.add(id);
  document.querySelectorAll('[data-journal-panel]').forEach(tile=>{
   const selected=journalExpandedSections.has(tile.dataset.journalPanel);
   tile.classList.toggle('is-active',selected);
   tile.setAttribute('aria-expanded',String(selected));
   const panel=document.getElementById(tile.dataset.journalPanel+'Panel');
   if(panel)panel.hidden=!selected;
  });
  if(!alreadyOpen){
   const openedPanel=document.getElementById(id+'Panel');
   if(openedPanel){
    requestAnimationFrame(()=>{
     if(!openedPanel.hidden){
      const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      openedPanel.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});
     }
    });
   }
  }
 }));
 const form=document.getElementById('journalForm');
 if(form){
  const title=document.getElementById('journalTitle'),body=document.getElementById('journalText'),answered=document.getElementById('journalAnswered');
  document.getElementById('journalNewPrayer')?.addEventListener('click',()=>{journalEditing='';form.reset();document.getElementById('journalEditorTitle').textContent='Prayer Request';openPrayerJournalModal()});
  document.getElementById('journalClosePrayer')?.addEventListener('click',closePrayerJournalModal);
  document.getElementById('journalPrayerModal')?.addEventListener('click',e=>{if(e.target.id==='journalPrayerModal')closePrayerJournalModal()});
  document.getElementById('journalClear').onclick=()=>{journalEditing='';form.reset();document.getElementById('journalEditorTitle').textContent='Prayer Request'};
  form.onsubmit=e=>{
   e.preventDefault();const entries=journalEntries(),now=new Date().toISOString();
   const entry={id:journalEditing||journalId(),type:'prayer',title:(journalEditing&&title.value.trim())||body.value.trim().replace(/\s+/g,' ').slice(0,65)+(body.value.trim().replace(/\s+/g,' ').length>65?'…':''),text:body.value.trim(),devotionalId:'',answered:answered.checked,createdAt:now,updatedAt:now};
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
 <section class="card"><p>Verses you save in the Bible Reader are kept here on this device. To add one, select Scripture in the Bible Reader and choose <strong>Save to My Favorite Verses</strong>.</p><p>To practice memorizing Scripture, select <strong>Practice</strong> beside a saved passage. Choose how many words to hide, try recalling the verse, and tap <strong>Reveal verse</strong> to check your memory. Practice at your own pace.</p><div class="actions"><a class="btn primary" href="/bible-reader.html">Open Bible Reader</a><button type="button" class="btn" id="favoriteMemoryNotifications">Notification Settings</button></div></section>
 ${favoriteVersePracticeHtml()}
 <section class="card"><h2>Saved Verses (${all.length})</h2><div class="actions"><label for="favoriteVerseSearch">Search <input id="favoriteVerseSearch" type="search" value="${safe(favoriteVerseSearch)}" placeholder="Search verses"></label><button class="btn" id="favoriteVerseExport" type="button">Export My Favorite Verses</button></div>
 <div class="grid">${filtered.map(v=>`<article class="card"><h3>${safe(v.reference)}</h3><div class="favorite-passage" style="line-height:1.85">${(Array.isArray(v.paragraphs)&&v.paragraphs.length?v.paragraphs:[v.text]).map(p=>`<p style="margin:.7em 0;white-space:pre-wrap">${safe(p)}</p>`).join('')}</div><div class="actions whdc-compact-actions"><button class="btn" data-verse-practice="${safe(v.id)}" aria-label="Practice verse">${compactAction('practice','Practice','Practice')}</button><button class="btn" data-verse-remove="${safe(v.id)}" aria-label="Remove">${compactAction('delete','Remove','Remove')}</button></div></article>`).join('')||'<p>No verses found. Save a verse to begin your collection.</p>'}</div></section>`;
}
function wireFavoriteVerses(){
 if(!document.getElementById('favoriteVerseSearch'))return;
 document.getElementById('favoriteMemoryNotifications')?.addEventListener('click',()=>openWHDCReminderPopup('memory'));
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
function quoteShareText(q){
 const link=new URL(devotionalHash(q.devotionalId),location.origin+'/').href;
 return `“${q.text}”\n\n— ${q.author||'Heather Kusunoki'}\n${q.devotionalTitle||'Devotional'}\n${link}`;
}
async function copySavedQuote(q){
 const message=quoteShareText(q);
 try{await navigator.clipboard.writeText(message);return true}
 catch{const input=document.createElement('textarea');input.value=message;input.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(input);input.select();let ok=false;try{ok=document.execCommand('copy')}catch{}input.remove();if(!ok)prompt('Copy this quote:',message);return ok}
}
async function shareSavedQuote(q){
 const message=quoteShareText(q);
 if(navigator.share){try{await navigator.share({text:message});return 'shared'}catch(error){if(error?.name==='AbortError')return 'cancelled'}}
 return await copySavedQuote(q)?'copied':'manual';
}
let quotesSearch='',quoteSelectionTimer=0;
let quoteSelectionAbort=new AbortController();
// Compact, accessible action buttons: full desktop labels and icon + one word on mobile.
const WHDC_ACTION_ICONS={copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',share:'<path d="M12 16V3m0 0-5 5m5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',open:'<path d="M14 4h6v6m0-6-9 9"/><path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"/>',delete:'<path d="M4 7h16M10 7V4h4v3m-8 0 1 13h10l1-13M10 11v5m4-5v5"/>',edit:'<path d="M12 20h9M16.5 3.5a2 2 0 0 1 4 4L9 19l-5 1 1-5Z"/>',practice:'<path d="M4 5h7a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3H4zM20 5h-3a3 3 0 0 0-3 3v12a3 3 0 0 1 3-3h3z"/>',export:'<path d="M12 3v12m0 0-5-5m5 5 5-5M5 17v4h14v-4"/>',new:'<path d="M12 5v14M5 12h14"/>',save:'<path d="M5 3h12l4 4v14H3V3zM7 3v6h10V3M7 21v-9h10v9"/>'};
function compactAction(icon,desktop,mobile){return `<span class="whdc-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${WHDC_ACTION_ICONS[icon]||WHDC_ACTION_ICONS.open}</svg></span><span class="whdc-action-desktop">${desktop}</span><span class="whdc-action-mobile">${mobile}</span>`}
function savedQuotesPage(){
 const all=savedQuotes().slice().sort((a,b)=>String(b.savedAt).localeCompare(String(a.savedAt)));
 const filtered=all.filter(q=>[q.text,q.author,q.devotionalTitle].join(' ').toLowerCase().includes(quotesSearch.toLowerCase()));
 return `<section class="hero"><div class="eyebrow">Words to return to</div><h1>Saved Quotes</h1><p>Highlight a meaningful passage while reading a devotional and tap ♡ Save Quote. Each quote includes its devotional author.</p></section>
 <section class="card"><div class="actions"><label for="savedQuotesSearch">Search quotes <input type="search" id="savedQuotesSearch" value="${safe(quotesSearch)}" placeholder="Search words, author or devotional"></label><button type="button" class="btn" id="exportSavedQuotes">Export Saved Quotes</button></div>
 <p class="muted small">Saved privately on this device. Export a backup before clearing browser data.</p>
 <div class="grid">${filtered.map(q=>`<article class="card"><blockquote style="white-space:pre-wrap;overflow-wrap:anywhere;margin:0 0 12px">“${safe(q.text)}”</blockquote><p class="muted small">— ${safe(q.author)} · ${safe(q.devotionalTitle)}</p><div class="actions whdc-compact-actions"><button type="button" class="btn" data-quote-copy="${safe(q.id)}" aria-label="Copy quote">${compactAction('copy','Copy Quote','Copy')}</button><button type="button" class="btn" data-quote-share="${safe(q.id)}" aria-label="Share quote">${compactAction('share','Share Quote','Share')}</button><button type="button" class="btn" data-quote-open="${safe(q.devotionalId)}" aria-label="Read devotional">${compactAction('open','Read devotional','Open')}</button><button type="button" class="btn" data-quote-delete="${safe(q.id)}" aria-label="Remove">${compactAction('delete','Remove','Remove')}</button></div></article>`).join('')||'<p>No quotes found yet. Open a devotional and highlight text to save a quote.</p>'}</div></section>`;
}
function wireSavedQuotes(){
 const search=document.getElementById('savedQuotesSearch');if(!search)return;
 search.onchange=e=>{quotesSearch=e.target.value;render()};
 document.querySelectorAll('[data-quote-copy]').forEach(b=>b.onclick=async()=>{
  const q=savedQuotes().find(x=>x.id===b.dataset.quoteCopy);if(!q)return;
  const ok=await copySavedQuote(q);if(ok){const label=b.querySelector('.whdc-action-mobile'),desktop=b.querySelector('.whdc-action-desktop');if(label)label.textContent='Copied';if(desktop)desktop.textContent='Copied!';setTimeout(()=>{if(b.isConnected){if(label)label.textContent='Copy';if(desktop)desktop.textContent='Copy Quote'}},1600)}
 });
 document.querySelectorAll('[data-quote-share]').forEach(b=>b.onclick=async()=>{
  const q=savedQuotes().find(x=>x.id===b.dataset.quoteShare);if(!q)return;
  const result=await shareSavedQuote(q);if(result==='copied'){const label=b.querySelector('.whdc-action-mobile'),desktop=b.querySelector('.whdc-action-desktop');if(label)label.textContent='Copied';if(desktop)desktop.textContent='Copied!';setTimeout(()=>{if(b.isConnected){if(label)label.textContent='Share';if(desktop)desktop.textContent='Share Quote'}},1600)}
 });
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
 const sections=()=>[...container.querySelectorAll('.whdc-quote-text')];
 const normalize=t=>String(t||'').replace(/\s+/g,' ').trim();
 const colors={yellow:'#ffe49b',green:'#bce8c8',blue:'#bfdcf9',pink:'#f5c6df'};
 const styleId='whdc-quote-selection-style';
 if(!document.getElementById(styleId)){
  const st=document.createElement('style');st.id=styleId;
  st.textContent=`#whdcQuoteToolbar{position:fixed;z-index:2147483000;display:flex;align-items:center;gap:5px;padding:5px 7px;border:1px solid #a59b89;border-radius:22px;background:#f7f5f0;color:#393f4a;box-shadow:0 3px 14px #0004;font:600 13px/1.25 system-ui,sans-serif;max-width:calc(100vw - 16px);touch-action:manipulation}#whdcQuoteToolbar[hidden],#whdcQuoteColors[hidden]{display:none!important}#whdcQuoteSave{border:0;background:transparent;color:inherit;padding:6px;white-space:nowrap;font:inherit;cursor:pointer}#whdcQuoteColorToggle{border:1px solid #a59b89;border-radius:50%;width:27px;height:27px;background:conic-gradient(#ffe49b 0 25%,#bce8c8 0 50%,#bfdcf9 0 75%,#f5c6df 0);cursor:pointer;flex-shrink:0}#whdcQuoteColors{display:flex;gap:4px;align-items:center}#whdcQuoteColors button{border:1px solid #aaa;background:#fff;color:#393f4a;border-radius:50%;height:25px;min-width:25px;padding:0 4px;cursor:pointer}#whdcQuoteColors button[data-style="underline"]{border-radius:6px;font-size:16px;text-decoration:underline}#quoteSelectableDevotional .whdc-quote-text,#quoteSelectableDevotional .whdc-quote-text *{user-select:text;-webkit-user-select:text;-webkit-touch-callout:default}`;
  for(const [key,value] of Object.entries(colors))st.textContent+=`::highlight(whdc-quote-${key}){background-color:${value}}`;
  st.textContent+='::highlight(whdc-quote-underline){text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}';document.head.append(st);
 }
 document.getElementById('whdcQuoteToolbar')?.remove();
 const bar=document.createElement('div');bar.id='whdcQuoteToolbar';bar.hidden=true;
 bar.innerHTML='<button type="button" id="whdcQuoteSave" aria-label="Save or unsave selected quote">♡ Save Quote</button><button type="button" id="whdcQuoteColorToggle" aria-label="Change quote marking" title="Change highlight or underline"></button><div id="whdcQuoteColors" hidden></div>';
 document.body.append(bar);
 const saveBtn=bar.querySelector('#whdcQuoteSave'),toggle=bar.querySelector('#whdcQuoteColorToggle'),palette=bar.querySelector('#whdcQuoteColors');
 for(const [key,value] of Object.entries(colors)){
  const el=document.createElement('button');el.type='button';el.dataset.style=key;el.style.background=value;el.title=key[0].toUpperCase()+key.slice(1);el.setAttribute('aria-label',el.title+' highlight');palette.append(el);
 }
 const under=document.createElement('button');under.type='button';under.dataset.style='underline';under.textContent='U';under.title='Underline';under.setAttribute('aria-label','Underline quote');palette.append(under);
 let chosen='',anchor=null,rect=null,active=false;
 const nodes=el=>{const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const arr=[];while(walker.nextNode())arr.push(walker.currentNode);return arr};
 const rangeFrom=(section,start,end)=>{
  const el=sections()[section];if(!el)return null;
  const arr=nodes(el);let pos=0,first=null,last=null;
  for(const node of arr){const next=pos+node.textContent.length;if(first===null&&start<next)first={node,offset:Math.max(0,start-pos)};if(end<=next){last={node,offset:Math.max(0,end-pos)};break}pos=next}
  if(!first||!last)return null;const r=document.createRange();r.setStart(first.node,first.offset);r.setEnd(last.node,last.offset);return r;
 };
 const locate=r=>{
  const els=sections();for(let i=0;i<els.length;i++){
   const el=els[i];if(!el.contains(r.startContainer)||!el.contains(r.endContainer))continue;
   const before=document.createRange();before.selectNodeContents(el);before.setEnd(r.startContainer,r.startOffset);
   return {section:i,start:before.toString().length,end:before.toString().length+r.toString().length};
  }return null;
 };
 const same=(q,t=chosen)=>q.devotionalId===d.id&&normalize(q.text)===normalize(t);
 const matching=()=>savedQuotes().find(q=>same(q));
 const paint=()=>{
  const quotes=savedQuotes().filter(q=>q.devotionalId===d.id);
  if(CSS.highlights&&typeof Highlight!=='undefined'){
   for(const key of [...Object.keys(colors),'underline'])CSS.highlights.delete('whdc-quote-'+key);
   const groups={};for(const q of quotes){
    const mark=q.markStyle||'yellow';const r=q.anchor?rangeFrom(q.anchor.section,q.anchor.start,q.anchor.end):null;
    if(r&&normalize(r.toString())===normalize(q.text))(groups[mark]??=[]).push(r);
   }
   for(const [key,ranges] of Object.entries(groups))if(ranges.length)CSS.highlights.set('whdc-quote-'+key,new Highlight(...ranges));
  }
 };
 // Existing saved quotes may lack anchors; locate their first matching occurrence.
 const upgrade=()=>{let changed=false;const list=savedQuotes();for(const q of list){if(q.devotionalId!==d.id||q.anchor)continue;
  for(let i=0;i<sections().length;i++){const text=sections()[i].textContent;const at=text.indexOf(q.text);if(at>=0){q.anchor={section:i,start:at,end:at+q.text.length};q.markStyle=q.markStyle||'yellow';changed=true;break}}
 }if(changed)saveQuotes(list)};
 upgrade();paint();
 const updateLabel=()=>{const q=matching();saveBtn.textContent=q?'♥ Save Quote':'♡ Save Quote';saveBtn.setAttribute('aria-pressed',q?'true':'false')};
 const position=()=>{if(!rect)return;bar.hidden=false;const vw=document.documentElement.clientWidth,vh=window.innerHeight,bw=bar.offsetWidth||150,bh=bar.offsetHeight||40;
  bar.style.left=Math.round(Math.max(8,Math.min(vw-bw-8,(rect.left+rect.right-bw)/2)))+'px';
  bar.style.top=Math.round(Math.max(8,rect.top>=bh+12?rect.top-bh-8:Math.min(vh-bh-8,rect.bottom+8)))+'px';
 };
 const update=()=>{
  if(!container.isConnected){bar.hidden=true;return}
  const sel=window.getSelection();if(!sel||sel.isCollapsed||!sel.rangeCount){if(!active){bar.hidden=true;chosen='';anchor=null;palette.hidden=true}return}
  const r=sel.getRangeAt(0),a=locate(r),t=normalize(sel.toString());if(!a||t.length<2){if(!active)bar.hidden=true;return}
  chosen=t;anchor=a;const rects=[...r.getClientRects()].filter(x=>x.width&&x.height);const rr=rects[rects.length-1]||r.getBoundingClientRect();
  rect={left:rr.left,right:rr.right,top:rr.top,bottom:rr.bottom};active=true;updateLabel();position();
 };
 const schedule=(ms=180)=>{clearTimeout(quoteSelectionTimer);quoteSelectionTimer=setTimeout(update,ms)};
 container.addEventListener('touchend',()=>{schedule(250);setTimeout(update,500)},{passive:true,signal:quoteSelectionAbort.signal});
 container.addEventListener('pointerup',()=>schedule(120),{signal:quoteSelectionAbort.signal});
 container.addEventListener('mouseup',()=>schedule(80),{signal:quoteSelectionAbort.signal});
 document.addEventListener('selectionchange',()=>{
  const sel=window.getSelection();if(!sel||sel.isCollapsed){if(active){clearTimeout(quoteSelectionTimer);quoteSelectionTimer=setTimeout(()=>{const current=window.getSelection();if(current&&!current.isCollapsed)return;active=false;chosen='';anchor=null;bar.hidden=true;palette.hidden=true},400)}return}schedule(220)
 },{signal:quoteSelectionAbort.signal});
 const toggleSave=()=>{
  if(!chosen)return;
  const list=savedQuotes(),existing=list.find(q=>same(q));
  if(existing)saveQuotes(list.filter(q=>q.id!==existing.id));
  else saveQuotes([...list,{id:'quote-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9),text:chosen,author:String(d.author||'Heather Kusunoki'),devotionalId:d.id,devotionalTitle:d.title,savedAt:new Date().toISOString(),anchor,markStyle:'yellow'}]);
  paint();updateLabel();position();
 };
 const applyStyle=style=>{if(!chosen)return;const list=savedQuotes();let q=list.find(x=>same(x));
  if(!q){q={id:'quote-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9),text:chosen,author:String(d.author||'Heather Kusunoki'),devotionalId:d.id,devotionalTitle:d.title,savedAt:new Date().toISOString(),anchor};list.push(q)}
  q.markStyle=style;q.anchor=anchor||q.anchor;saveQuotes(list);paint();updateLabel();palette.hidden=true;position();
 };
 // Preserve the selected text when tapping the floating controls.
 bar.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')e.preventDefault()},{signal:quoteSelectionAbort.signal});
 bar.addEventListener('touchend',e=>{const target=e.target.closest('button');if(!target)return;e.preventDefault();e.stopPropagation();if(target===saveBtn)toggleSave();else if(target===toggle){palette.hidden=!palette.hidden;position()}else if(target.dataset.style)applyStyle(target.dataset.style)},{passive:false,signal:quoteSelectionAbort.signal});
 bar.addEventListener('click',e=>{if(e.detail===0||!('ontouchstart' in window)){const target=e.target.closest('button');if(target===saveBtn)toggleSave();else if(target===toggle){palette.hidden=!palette.hidden;position()}else if(target?.dataset.style)applyStyle(target.dataset.style)}},{signal:quoteSelectionAbort.signal});
 document.addEventListener('pointerdown',e=>{if(!bar.contains(e.target)&&!container.contains(e.target)&&active){active=false;chosen='';anchor=null;bar.hidden=true;palette.hidden=true}},{signal:quoteSelectionAbort.signal});
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
 return `<section class="hero"><div class="eyebrow">Reading plan</div><h1>${safe(p.title)}</h1><p>${safe(p.description||'')}</p><p>${done} of ${p.devotional_ids.length} devotionals completed</p><progress max="${p.devotional_ids.length}" value="${done}" style="width:100%;max-width:500px;height:16px" aria-label="Plan progress"></progress><div class="actions"><button class="btn primary" id="planStart">${joined?'Continue reading':'Start this plan'}</button>${joined?'<button class="btn" id="planLeave">Remove from my plans</button>':''}<button class="btn" id="planBack">← Back to Reading Plans</button></div></section><div class="grid">${p.devotional_ids.map((id,i)=>{const d=data.find(x=>x.id===id);return d?`<article class="card"><div class="eyebrow">Reading ${i+1} of ${p.devotional_ids.length}</div><h3>${safe(d.title)}</h3>${readBadge(id)}<div class="actions"><button class="btn" data-open="${safe(id)}" aria-label="Read devotional">${compactAction('open','Read devotional','Open')}</button><button class="btn" data-plan-read="${safe(id)}">${readDate(id)?'✓ Mark unread':'Mark as read'}</button></div></article>`:''}).join('')}</div>`;
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
  openWHDCReminderPopup('plan',()=>openFromReadingPlan(p.devotional_ids.find(id=>!readDate(id))||p.devotional_ids[0],p.id));
 });
 document.getElementById('planLeave')?.addEventListener('click',()=>{localStorage.setItem(PLAN_ENROLL_KEY,JSON.stringify(planEnrollments().filter(id=>id!==selectedReadingPlan)));syncReadingPlanPush().catch(()=>{});render()});
 document.querySelectorAll('[data-plan-read]').forEach(b=>b.onclick=()=>afterPlanReadingMarked(b.dataset.planRead));
}
async function loadCustomReadingPlans(){
 try{const response=await fetch('/api/reading-plans',{cache:'no-store'});if(response.ok){const plans=await response.json();if(Array.isArray(plans))customReadingPlans=plans}}catch(e){console.warn('Reading plans unavailable',e)}
 if(view==='plans'||view==='plan-detail'||view==='plan-complete')render();
}
let selectedReadingPlan='';
let activeReadingPlan=''; // Set only when a devotional was opened from a reading plan.


function openingSettings(){const chosen=openingPage();const options=[['home','Home','Start with the welcome page'],['today','Today','Open the daily devotional'],['bible','Bible','Open the Bible Reader'],['explore','Explore','Browse plans, journals, and other resources']];return `<section class="hero" style="max-width:760px;margin:0 auto"><div class="eyebrow">Your reading experience</div><h1>Settings</h1><p>Choose where When Healing Doesn't Come opens on this device. You can change this anytime.</p></section><section class="card" style="max-width:760px;margin:0 auto 2rem"><h2>Opening page</h2><fieldset style="border:0;padding:0;margin:0"><legend class="muted small" style="margin-bottom:12px">When I launch the app, open:</legend>${options.map(([id,label,description])=>`<label style="display:block;margin:12px 0"><input type="radio" name="openingPage" value="${id}" ${chosen===id?'checked':''}> ${label} <span class="muted small">— ${description}</span></label>`).join('')}</fieldset><p class="muted small" id="openingSaved" role="status">Your choice is saved on this device.</p><p class="muted small">Links to specific pages still work normally.</p></section>`}
// Offline reading is opt-in. Only published, public devotional data is stored.
const WHDC_OFFLINE_KEY='whdc-offline-public-devotionals-v1';
const READING_SIZE_KEY='whdc-reading-size';
const APPEARANCE_KEY='whdc-appearance';
const WHDC_DYSLEXIA_KEY='whdc-dyslexia-mode';
const WHDC_DYSLEXIA_FONT_KEY='whdc-dyslexia-font';
const WHDC_DYSLEXIA_LETTER_KEY='whdc-dyslexia-letter';
const WHDC_DYSLEXIA_LINE_KEY='whdc-dyslexia-line';
const WHDC_DYSLEXIA_WORD_KEY='whdc-dyslexia-word';
function readingSize(){return Math.max(80,Math.min(150,Number(localStorage.getItem(READING_SIZE_KEY))||100))}
function appearance(){const a=localStorage.getItem(APPEARANCE_KEY);return ['light','dark','system'].includes(a)?a:'system'}
function applyReadingPreferences(){document.documentElement.style.setProperty('--whdc-reading-scale',String(readingSize()/100));const dark=appearance()==='dark'||(appearance()==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.body.classList.toggle('dark',dark);document.body.classList.remove('large');window.WHDCDyslexia?.apply()}
function audioReadingSettings(){return `<section class="card" style="max-width:760px;margin:0 auto 2rem"><h2>Audio Reading</h2><p class="muted small">Choose your preferred AI narration and device reading voices. AI narration is used when a recording exists. Otherwise your device reader is used.</p><div style="display:grid;gap:14px"><div><label for="settingsAiVoiceChoice" class="muted small">Default AI voice</label><div class="actions" style="gap:8px;align-items:center"><select id="settingsAiVoiceChoice" aria-label="Default AI voice"><option value="sulafat" ${preferredAIVoice()==='sulafat'?'selected':''}>Female</option><option value="sadachbia" ${preferredAIVoice()==='sadachbia'?'selected':''}>Male</option></select><button class="btn" type="button" id="sampleAiVoice">▶ Sample</button></div><p id="aiSampleStatus" class="muted small" role="status"></p></div><div><label for="settingsDeviceVoiceChoice" class="muted small">Default device voice</label><div class="actions" style="gap:8px;align-items:center"><select id="settingsDeviceVoiceChoice" aria-label="Default device voice">${deviceVoiceOptions()}</select><button class="btn" type="button" id="sampleDeviceVoice">▶ Sample</button></div></div><div><label for="settingsvoiceSpeed" class="muted small">Default reading speed</label><select id="settingsvoiceSpeed" aria-label="Default reading speed">${speedOptions()}</select></div></div><p class="muted small">Preferences are saved on this device. AI samples are recorded once in the Audio Library and can be replayed without generating new audio.</p></section>`}
function readingAppearanceSettings(){const size=readingSize(),mode=appearance();return `<section class="card whdc-reading-settings" style="max-width:760px;margin:0 auto 2rem"><h2>Reading &amp; Appearance</h2><p class="muted small">Adjust how devotionals and Scripture appear on this device.</p><fieldset><legend>Reading text size</legend><div class="actions" style="align-items:center"><button type="button" class="btn" id="readingSmaller" aria-label="Decrease reading text size" ${size<=80?'disabled':''}>A−</button><output id="readingSizeValue" role="status" aria-label="Reading text size" aria-live="polite" aria-atomic="true">${size}%</output><button type="button" class="btn" id="readingLarger" aria-label="Increase reading text size" ${size>=150?'disabled':''}>A+</button><button type="button" class="btn" id="readingReset" aria-label="Reset reading text size to 100 percent">Reset</button></div><div class="whdc-reading-preview" aria-label="Reading text size preview"><div class="muted small whdc-preview-label">Text size preview</div><p id="readingPreviewText" aria-live="off">God is with us in every season, offering hope and strength for the journey ahead.</p></div></fieldset><fieldset><legend>Appearance theme</legend>${[['system','System Default'],['light','Light'],['dark','Dark']].map(([v,label])=>`<label class="whdc-appearance-option"><input type="radio" name="readingAppearance" value="${v}" ${mode===v?'checked':''}> ${label}</label>`).join('')}</fieldset><p class="muted small" role="status" id="readingPreferencesSaved">Your preferences are saved on this device.</p></section>`}
function accessibilitySettings(){return `<section class="card whdc-accessibility-settings" style="max-width:760px;margin:0 auto 2rem"><h2>Accessibility</h2><p class="muted small">Choose the reading and interaction options that work best for you. These settings are saved on this device.</p><fieldset class="whdc-dyslexia-controls"><legend>Dyslexia-friendly reading</legend><label class="whdc-dyslexia-toggle"><input type="checkbox" id="dyslexiaEnabled"> Enable dyslexia-friendly mode</label><p class="muted small">Uses a clearer reading font and more generous spacing. Customize the options below to find what works for you.</p><div class="whdc-dyslexia-options"><label for="dyslexiaFont">Reading font</label><select id="dyslexiaFont"><option value="verdana">Verdana</option><option value="arial">Arial</option><option value="trebuchet">Trebuchet MS</option><option value="system">System font</option></select><label for="dyslexiaLetters">Letter spacing <output id="dyslexiaLettersValue"></output></label><input type="range" id="dyslexiaLetters" min="0" max="0.12" step="0.02"><label for="dyslexiaLines">Line spacing <output id="dyslexiaLinesValue"></output></label><input type="range" id="dyslexiaLines" min="1.5" max="2.2" step="0.1"><label for="dyslexiaWords">Word spacing <output id="dyslexiaWordsValue"></output></label><input type="range" id="dyslexiaWords" min="0" max="0.3" step="0.05"></div></fieldset><fieldset><legend>Motion and contrast</legend><label class="whdc-accessibility-toggle"><input type="checkbox" id="accessReduceMotion"> Reduce motion</label><p class="muted small">Minimize animations and smooth scrolling.</p><label class="whdc-accessibility-toggle"><input type="checkbox" id="accessHighContrast"> Higher contrast</label><p class="muted small">Make text, borders, and controls easier to distinguish.</p></fieldset><fieldset><legend>Reading layout</legend><label class="whdc-accessibility-toggle"><input type="checkbox" id="accessSimplifiedReading"> Simplified reading</label><p class="muted small">Use a quieter layout with comfortable text width for devotional reading.</p></fieldset><p class="muted small" role="status" id="accessibilitySaved">Changes are saved automatically.</p></section>`}
function wireAccessibilitySettings(){window.WHDCDyslexia?.wire();for(const [id,key] of [['accessReduceMotion','whdc-access-reduce-motion'],['accessHighContrast','whdc-access-high-contrast'],['accessSimplifiedReading','whdc-access-simplified-reading']]){const el=document.getElementById(id);if(!el)continue;try{el.checked=localStorage.getItem(key)==='1'}catch{}el.addEventListener('change',()=>{try{localStorage.setItem(key,el.checked?'1':'0')}catch{}applyAccessibilityPreferences()})}}
function applyAccessibilityPreferences(){for(const [key,cls] of [['whdc-access-reduce-motion','whdc-reduce-motion'],['whdc-access-high-contrast','whdc-high-contrast'],['whdc-access-simplified-reading','whdc-simplified-reading']]){let on=false;try{on=localStorage.getItem(key)==='1'}catch{}document.documentElement.classList.toggle(cls,on)}}
applyAccessibilityPreferences();
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
// Refresh an existing opt-in offline devotional download only when the server
// reports a newer version. Do not create a download for people who opted out.
const WHDC_OFFLINE_VERSION_KEY='whdc-offline-public-devotionals-validator-v1';
let offlineRefreshRunning=false;
async function refreshOfflineDevotionalsIfChanged(){
 if(offlineRefreshRunning||!navigator.onLine||!localStorage.getItem(WHDC_OFFLINE_KEY))return;
 offlineRefreshRunning=true;
 try{
  const head=await fetch('/api/devotionals',{method:'HEAD',cache:'no-store'});
  if(!head.ok)return;
  const tag=head.headers.get('etag');
  const modified=head.headers.get('last-modified');
  const size=head.headers.get('content-length');
  const validator=tag?'etag:'+tag:modified&&size?'modified:'+modified+':'+size:null;
  if(!validator)return; // Do not bulk-download when the server lacks validators.
  if(localStorage.getItem(WHDC_OFFLINE_VERSION_KEY)===validator)return;
  const response=await fetch('/api/devotionals',{cache:'no-store'});
  if(!response.ok)return;
  const items=await response.json();validate(items);
  if(!Array.isArray(items)||!items.length)return;
  const serialized=JSON.stringify(items);
  if(localStorage.getItem(WHDC_OFFLINE_KEY)!==serialized)localStorage.setItem(WHDC_OFFLINE_KEY,serialized);
  localStorage.setItem(WHDC_OFFLINE_VERSION_KEY,validator);
 }catch(e){console.warn('Offline devotional update postponed',e)}
 finally{offlineRefreshRunning=false}
}
window.addEventListener('online',refreshOfflineDevotionalsIfChanged);window.addEventListener('storage',e=>{if(e.key?.startsWith('whdc-access-'))applyAccessibilityPreferences()});
window.addEventListener('load',refreshOfflineDevotionalsIfChanged);
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
   localStorage.removeItem(WHDC_OFFLINE_VERSION_KEY);
   status.textContent=items.length+' devotionals saved for offline reading on this device.';
  }catch(err){status.textContent='Download failed: '+err.message}
  finally{download.disabled=false}
 };
 remove.onclick=()=>{localStorage.removeItem(WHDC_OFFLINE_KEY);localStorage.removeItem(WHDC_OFFLINE_VERSION_KEY);status.textContent='Offline download removed.'};
}
function wireOpeningSettings(){document.querySelectorAll('input[name="openingPage"]').forEach(r=>r.onchange=()=>{if(r.checked){localStorage.setItem(START_PAGE_KEY,r.value);const status=$('#openingSaved');if(status)status.textContent=`Saved! Your app will open to ${{home:"Home",today:"Today",bible:"Bible",explore:"Explore"}[r.value]||"Today"}.`}})}
function welcomeOpeningChoice(){if(!installedApp()||localStorage.getItem(START_PAGE_KEY)||!localStorage.getItem(VISITED_KEY))return;const overlay=document.createElement('div');overlay.id='openingPrompt';overlay.className='whdc-start-overlay';overlay.innerHTML=`<section class="card whdc-start-dialog" role="dialog" aria-modal="true" aria-labelledby="openingPromptTitle"><div class="eyebrow">Welcome back</div><h2 id="openingPromptTitle">Where would you like to begin?</h2><p>Choose the page you'd like to see when you open this app. You can change it later in Settings.</p><div class="actions" style="gap:12px;flex-wrap:wrap"><button class="btn primary" id="chooseToday" type="button">Devotional of the Day</button><button class="btn" id="chooseHome" type="button">Home</button></div></section>`;document.body.appendChild(overlay);const close=choice=>{localStorage.setItem(START_PAGE_KEY,choice);overlay.remove();view=choice;history.replaceState(null,'','#'+choice);render()};$('#chooseToday').onclick=()=>close('today');$('#chooseHome').onclick=()=>close('home');$('#chooseToday').focus()}
function addAppStyles(){if(document.getElementById('whdc-nav-styles'))return;const style=document.createElement('style');style.id='whdc-nav-styles';style.textContent=` .whdc-alert-wrap[hidden]{display:none!important}.whdc-alert-wrap{position:fixed;top:12px;right:72px;z-index:2500;display:flex;align-items:center;background:var(--card,#fff);color:var(--text,#273632);border:1px solid var(--border,#bbc7c3);border-radius:999px;box-shadow:0 2px 12px #0002}.whdc-alert-bell{position:relative;display:inline-flex;align-items:center;justify-content:center;width:42px;height:44px;border:0;border-radius:9px;background:transparent;color:inherit;cursor:pointer}.whdc-alert-bell:hover,.whdc-alert-bell:focus-visible{background:rgba(120,140,145,.12)}.whdc-alert-dot{position:absolute;top:7px;right:7px;width:9px;height:9px;border-radius:50%;background:#b54a4a;border:0;box-shadow:none}.whdc-alert-dot[hidden],.whdc-alert-panel[hidden]{display:none!important}.whdc-alert-panel{position:absolute;right:-44px;top:calc(100% + 5px);z-index:1100;width:min(340px,calc(100vw - 24px));max-height:min(440px,70dvh);overflow:auto;background:var(--card,#fff);color:var(--text,#273632);border:1px solid var(--border,#bbc7c3);border-radius:13px;box-shadow:0 14px 35px #0003;padding:14px;box-sizing:border-box}.whdc-alert-head,.whdc-alert-actions{display:flex;justify-content:space-between;align-items:center;gap:8px}.whdc-alert-head{margin-bottom:12px}.whdc-alert-close{background:transparent;border:0;color:inherit;cursor:pointer;font-size:17px}.whdc-alert-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 0;border-bottom:1px solid var(--border,#ddd)}.whdc-alert-row .btn{padding:6px 9px;font-size:12px}.whdc-alert-actions{justify-content:flex-end;flex-wrap:wrap;margin-top:12px}.whdc-alert-actions .btn{padding:8px 10px;font-size:13px}.whdc-alert-settings-button{display:inline-flex;align-items:center;justify-content:center;gap:7px}.whdc-alert-settings-button svg{display:block;flex:none}.whdc-menu-button{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;width:46px;height:44px;padding:8px;border:0;background:transparent;color:inherit;border-radius:8px;margin-left:0}.whdc-menu-button:hover,.whdc-menu-button:focus-visible{background:rgba(120,140,145,.12)}.whdc-menu-icon{display:flex;flex-direction:column;justify-content:space-between;width:25px;height:19px}.whdc-menu-icon span{display:block;width:100%;height:2.5px;border-radius:3px;background:currentColor}.whdc-header-top{position:relative;flex-wrap:nowrap!important;justify-content:space-between;overflow:visible}.whdc-nav{position:absolute;top:100%;right:0;left:auto;z-index:1000;box-sizing:border-box;width:190px;min-width:0;max-width:calc(100vw - 32px);display:flex;flex-direction:column;align-items:stretch;gap:0;padding:0;background:#fff;color:#293d3a;border:0;border-radius:0;box-shadow:0 12px 30px rgba(25,40,45,.18)}.whdc-nav .navbtn{display:flex;text-decoration:none!important;align-items:center;justify-content:center;width:100%;height:46px;box-sizing:border-box;text-align:center;font-size:16px!important;font-weight:500;line-height:1.35;white-space:nowrap;padding:0 8px;border:0;border-radius:0;background:#fff;color:#293d3a;transition:background-color .16s ease,color .16s ease}.whdc-nav .navbtn:nth-child(even){background:#fff}.whdc-nav .navbtn:hover,.whdc-nav .navbtn:focus-visible{ text-decoration:none!important;background:#7f9991;color:#fff;font-size:16px!important}.whdc-nav .navbtn[aria-current="page"],.whdc-nav .navbtn.active,.whdc-nav .navbtn:active{text-decoration:none!important;background:#7f9991;color:#fff;font-size:16px!important}.whdc-nav .navbtn[data-nav="home"]{letter-spacing:.46em;}.whdc-nav .navbtn[data-nav="today"]{letter-spacing:.29em;}.whdc-nav .navbtn[data-nav="topics"]{letter-spacing:.19em;}.whdc-nav .navbtn[data-nav="saved"]{letter-spacing:.31em;}.whdc-nav .navbtn[data-nav="history"]{letter-spacing:.10em;}.whdc-nav .navbtn[data-nav="support"]{letter-spacing:.20em;}.whdc-nav .navbtn[data-nav="contact"]{letter-spacing:.12em;}.whdc-nav .navbtn[data-nav="settings"]{letter-spacing:.07em;}.whdc-nav .navbtn[data-nav="bible"]{letter-spacing:.39em;}.home-reading > .reading{width:100%;max-width:760px;box-sizing:border-box;margin-left:auto;margin-right:auto}.whdc-nav[hidden]{display:none!important}.whdc-contact-card form label{display:block;margin-top:16px;margin-bottom:7px;font-weight:600}.whdc-contact-card form input:not([type=hidden]),.whdc-contact-card form textarea{display:block;width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #9da9a8;border-radius:9px;background:var(--card,#fff);color:inherit;font:inherit}.whdc-contact-card form textarea{resize:vertical}.whdc-contact-card form :focus-visible{outline:3px solid #6d9199;outline-offset:2px}.whdc-start-overlay{position:fixed;inset:0;z-index:9999;background:rgba(20,30,35,.65);display:flex;align-items:center;justify-content:center;padding:18px}.whdc-start-dialog{width:min(100%,480px);max-height:90vh;overflow:auto;padding:clamp(20px,4vw,36px)}.whdc-compact-actions .whdc-action-icon,.whdc-compact-actions .whdc-action-mobile{display:none}.whdc-compact-actions .whdc-action-desktop{display:inline}@media(max-width:700px){.whdc-compact-actions{display:flex;flex-wrap:wrap;gap:8px!important}.whdc-compact-actions .btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:9px 10px;min-height:42px;white-space:nowrap;font-size:13px}.whdc-compact-actions .whdc-action-icon{display:inline-flex;align-items:center}.whdc-compact-actions .whdc-action-desktop{display:none}.whdc-compact-actions .whdc-action-mobile{display:inline}}@media(max-width:700px){.whdc-alert-wrap{position:fixed!important;top:calc(env(safe-area-inset-top, 0px) + 8px);right:12px;left:auto;z-index:2500;margin:0!important;display:flex!important;align-items:center;justify-content:center;background:var(--card,#fff);color:var(--text,#273632);border:1px solid var(--border,#bbc7c3);border-radius:999px;box-shadow:0 2px 12px #0002}.whdc-alert-bell{width:42px;height:42px;border-radius:999px}.whdc-alert-panel{position:fixed!important;top:calc(env(safe-area-inset-top, 0px) + 58px);right:12px;left:auto;width:min(340px,calc(100vw - 24px));max-height:calc(100dvh - env(safe-area-inset-top, 0px) - 80px);z-index:2501}.whdc-alert-dot{top:5px;right:5px}}@media(max-width:700px){.whdc-nav{position:absolute;top:100%;left:calc(50% - 50vw);right:auto;width:100vw;max-width:none;border-radius:0;padding:0;box-shadow:0 12px 25px rgba(25,40,45,.15)}.whdc-nav .navbtn{width:100%;text-align:center;padding:0 8px;border-radius:0;margin:0}}`;document.head.appendChild(style)}

// Notification center: shows outstanding app badge alerts, not the OS notification history.
function wireAlertCenter(){
 const bell=document.getElementById('whdcAlertBell'),panel=document.getElementById('whdcAlertPanel'),list=document.getElementById('whdcAlertList'),dot=document.getElementById('whdcAlertDot');if(!bell||!panel)return;const wrap=bell.closest('.whdc-alert-wrap');
 const types=[['announcement',"What's New",'home'],['daily','Devotional','today'],['plan','Reading Plan','plans']];
 const ask=async(type)=>{if(!('serviceWorker'in navigator))return null;const reg=await navigator.serviceWorker.ready;const worker=navigator.serviceWorker.controller||reg.active;if(!worker)return null;return await new Promise(resolve=>{const channel=new MessageChannel();const timer=setTimeout(()=>resolve(null),2500);channel.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data)};worker.postMessage({type},[channel.port2])})};
 const refresh=async()=>{const status=await ask('WHDC_ALERT_STATUS');if(!bell.isConnected)return;const counts=status?.counts||{};const prefs=status?.prefs||{};const active=types.filter(([key])=>prefs[key]!==false&&Number(counts[key])>0);dot.hidden=!active.length;if(wrap){wrap.hidden=!active.length;if(!active.length){panel.hidden=true;bell.setAttribute('aria-expanded','false')}}bell.setAttribute('aria-label',active.length===1?'1 unread notification':`${active.length} unread notification categories`);const clearButton=document.getElementById('whdcAlertClear');if(clearButton)clearButton.hidden=!active.length;const escapeAlert=t=>String(t||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const titles={announcement:"What's New",daily:"Today's Devotional",plan:'Reading Reminder'};
 const descriptions={announcement:'A new announcement is available.',daily:"Take a moment with today's devotional.",plan:'Continue your reading plan when you are ready.'};
 const alerts=Array.isArray(status?.alerts)?status.alerts:[];
 list.innerHTML=!status?'<p class="muted small">Unable to read alerts. Close and reopen the app to finish updating.</p>':active.length?active.flatMap(([key])=>{const matching=alerts.filter(a=>a.type===key);const shown=matching.length?matching:[{type:key,title:titles[key],body:descriptions[key]}];return shown.map(a=>`<button class="whdc-alert-row whdc-alert-entry" data-alert-open="${key}" type="button" style="display:block;width:100%;text-align:left;cursor:pointer"><strong>${escapeAlert(a.title||titles[key])}</strong><span style="display:block;margin-top:4px;white-space:normal">${escapeAlert(a.body||descriptions[key])}</span></button>`)}).join(''):'<p class="muted small">No new notifications.</p>';};
 const close=()=>{panel.hidden=true;bell.setAttribute('aria-expanded','false')};
 bell.onclick=async()=>{const opening=panel.hidden;panel.hidden=!opening;bell.setAttribute('aria-expanded',String(opening));if(opening)await refresh()};
 document.getElementById('whdcAlertClose').onclick=close;
 document.getElementById('whdcAlertClear').onclick=async()=>{const result=await ask('WHDC_ALERT_CLEAR_ALL');if(result?.ok){await refresh()}else list.textContent='Could not clear alerts. Please try again.'};
 document.getElementById('whdcAlertSettings').onclick=()=>{close();view='settings';render();document.querySelectorAll('.whdc-settings-collapsible').forEach(d=>{if(d.querySelector('.whdc-notifications'))d.open=true})};
 list.onclick=async e=>{const button=e.target.closest('[data-alert-open]');if(!button)return;const type=button.dataset.alertOpen;button.disabled=true;const result=await ask('WHDC_BADGE_CLEAR_ONE:'+type);if(!result?.ok){button.disabled=false;list.insertAdjacentHTML('beforeend','<p class="muted small">Could not clear this notification. Please try again.</p>');return}close();if(type==='announcement'){view='home'}else if(type==='daily'){view='today'}else{view='plans'}render()};
 if(!window.__whdcAlertOutsideBound){window.__whdcAlertOutsideBound=true;document.addEventListener('pointerdown',e=>{const p=document.getElementById('whdcAlertPanel');if(p&&!p.hidden&&!e.target.closest('.whdc-alert-wrap')){p.hidden=true;document.getElementById('whdcAlertBell')?.setAttribute('aria-expanded','false')}})}
 refresh();
}

function wireMenu(){const toggle=$('#menuToggle'),menu=$('#mainMenu');if(!toggle||!menu)return;toggle.onclick=()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu')};toggle.onkeydown=e=>{if(e.key==='Escape'&&!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}};menu.onkeydown=e=>{if(e.key==='Escape'){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}}}
function nav(v){if(v==='read'){const id=selectedTopicReading();if(id&&data.some(d=>d.id===id)){currentId=id;view='today';history.pushState(null,'',devotionalHash(id));render();return}v='explore'}if(v!=='today')activeReadingPlan='';if(!selectedTopicReading())clearOpenDevotional();if(v==='admin'){location.assign('/admin');return}view=v;history.pushState(null,'',v==='admin'?'#admin':v==='bible'?'#bible':v==='explore'?'#explore':v==='topics'?'#topics':v==='saved'?'#saved':v==='history'?'#history':v==='study-guide'?'#study-guide':v==='saved-quotes'?'#saved-quotes':v==='favorite-verses'?'#favorite-verses':v==='journal'?'#journal':v==='plans'?'#plans':v==='milestones'?'#milestones':v==='plan-detail'?'#plan-detail':v==='plan-complete'?'#plan-complete':v==='about'?'#about':v==='support'?'#support':v==='contact'?'#contact':v==='settings'?'#settings':v==='home'?'#home':'#today');render();scrollTo(0,0)}window.WHDCNavigate=nav;function devotionalCardPreview(text,maxLength=155){
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
function speedOptions(){return [['0.75','0.75x'],['0.9','0.9x'],['1','1x'],['1.15','1.15x']].map(([n,t])=>`<option value="${n}" ${audioRate()===Number(n)?'selected':''}>${t}</option>`).join('')}
function deviceVoiceOptions(){const selected=chosenVoice()?.voiceURI||'';return `<option value="">Device automatic</option>`+voiceChoices().map(v=>`<option value="${safe(v.voiceURI)}" ${selected===v.voiceURI?'selected':''}>${safe(v.name)} (${safe(v.lang)})</option>`).join('')}
const WHDC_COMPACT_AUDIO_CSS=`
.whdc-audio-primary-row{display:flex;flex-wrap:nowrap!important;gap:5px!important;align-items:center;min-width:0;width:100%}
.whdc-audio-primary-row>#listen{flex:0 0 auto;white-space:nowrap;padding:7px 10px;font-size:.84rem}
.whdc-audio-primary-row .whdc-voice-options{display:flex;flex:1 1 auto;min-width:0;flex-wrap:nowrap!important;gap:4px!important;align-items:center}
.whdc-audio-primary-row .whdc-voice-options label{font-size:.7rem;white-space:nowrap}
.whdc-audio-primary-row .whdc-voice-options label[for=voiceChoice]{display:none}
.whdc-audio-primary-row #voiceChoice{flex:1 1 auto;min-width:0!important;width:0!important;max-width:none!important;padding:5px 3px!important;font-size:.73rem!important}
@media(min-width:768px){.whdc-audio-primary-row{justify-content:flex-start!important;gap:8px!important}.whdc-audio-primary-row .whdc-voice-options{flex:0 1 auto!important;width:auto!important;gap:6px!important}.whdc-audio-primary-row #voiceChoice{flex:0 1 155px!important;width:155px!important;max-width:155px!important;padding:5px 7px!important;font-size:.8rem!important}.whdc-audio-primary-row #voiceSpeed{flex:0 0 68px!important;width:68px!important;max-width:68px!important;font-size:.8rem!important}.whdc-audio-primary-row .whdc-voice-options label[for=voiceSpeed]{font-size:.76rem}}
.whdc-audio-primary-row #voiceSpeed{flex:0 0 60px;width:60px!important;max-width:60px!important;padding:5px 2px!important;font-size:.73rem!important}
@media(max-width:390px){.whdc-audio-primary-row{gap:3px!important}.whdc-audio-primary-row>#listen{padding:6px 7px;font-size:.78rem}.whdc-audio-primary-row .whdc-voice-options label[for=voiceSpeed]{display:none}.whdc-audio-primary-row #voiceSpeed{flex-basis:54px;width:54px!important;max-width:54px!important}}
`;
if(!document.getElementById('whdc-compact-audio-css')){const compactStyle=document.createElement('style');compactStyle.id='whdc-compact-audio-css';compactStyle.textContent=WHDC_COMPACT_AUDIO_CSS;document.head.appendChild(compactStyle)}
function voiceSettings(prefix='',recordedVoices=[]){const aiVoices=recordedVoices||[],preferred=preferredAIVoice(),active=selectedReadingVoice();const effective=aiVoices.length?'recorded:'+(aiVoices.includes(active.slice(9))&&active.startsWith('recorded:')?active.slice(9):aiVoices.includes(preferred)?preferred:aiVoices.includes('sulafat')?'sulafat':aiVoices[0]):(localStorage.getItem(DEVICE_VOICE_KEY)||'');return `<div class="actions whdc-voice-options" style="align-items:center;gap:6px;flex-wrap:wrap;font-size:.82rem"><label for="${prefix}voiceChoice" class="muted small">Reading voice</label><select id="${prefix}voiceChoice" aria-label="Reading voice" style="max-width:190px;width:100%;padding:5px 7px;font-size:.82rem;border-radius:8px;border:1px solid #aaa;background:var(--card,#fff);color:inherit">${aiVoices.length?aiVoices.map(v=>`<option value="recorded:${v}" ${effective==='recorded:'+v?'selected':''}>${v==='sulafat'?'Female':'Male'}</option>`).join(''):`<option value="">Device automatic</option>${voiceChoices().map(v=>`<option value="${safe(v.voiceURI)}" ${effective===v.voiceURI?'selected':''}>${safe(v.name)} (${safe(v.lang)})</option>`).join('')}`}</select><label for="${prefix}voiceSpeed" class="muted small">Speed</label><select id="${prefix}voiceSpeed" aria-label="Reading speed" style="width:105px;max-width:105px;padding:5px 7px;font-size:.82rem;border-radius:8px;border:1px solid #aaa;background:var(--card,#fff);color:inherit">${speedOptions()}</select></div>`}
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
(function(){if(document.getElementById('whdc-speaker-only-style'))return;const style=document.createElement('style');style.id='whdc-speaker-only-style';style.textContent='.whdc-icon-listen{font-size:0!important;display:inline-flex!important;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:8px!important}.whdc-icon-listen::before{content:"🔊";font-size:21px;line-height:1}.whdc-icon-listen[data-playing="true"]::before{content:"⏸"}.whdc-icon-listen[data-paused="true"]::before{content:"▶"}.whdc-icon-listen:focus-visible{outline:2px solid currentColor;outline-offset:3px}.whdc-devotional-audio-header{position:relative}.whdc-audio-scope-label{position:absolute;z-index:80;top:calc(100% + 3px);left:0;flex-direction:column;min-width:145px;background:var(--card,#fff);color:var(--text,inherit);border:1px solid var(--border,#aaa);border-radius:9px;box-shadow:0 8px 24px #0002;padding:5px}.whdc-audio-scope-label button{background:transparent;color:inherit;border:0;text-align:left;padding:11px 12px;font:inherit;font-size:.9rem;cursor:pointer;border-radius:6px}.whdc-audio-scope-label button:hover,.whdc-audio-scope-label button:focus-visible{background:var(--surface,#8882);outline:2px solid currentColor;outline-offset:-2px}';document.head.appendChild(style)})();
function wireWHDCIconListenButtons(){for(const button of document.querySelectorAll(".whdc-icon-listen")){const base=button.id==="deeperListen"?"Go Deeper":button.id==="scriptureListen"?"Scripture Reading":"Short Devotional";const sync=()=>{const playback=window.WHDCAudio?.state?.();const relevant=playback?.id===currentId&&playback?.part===(button.id==="deeperListen"?"deeper":button.id==="scriptureListen"?"scripture":"devotional");const paused=relevant&&playback.paused;const playing=relevant&&!playback.paused||/stop|pause|■/i.test(button.textContent||"")&&!paused;button.dataset.playing=String(playing);button.dataset.paused=String(!!paused);button.setAttribute("aria-label",paused?"Resume "+base+" audio":playing?"Pause "+base+" audio":"Listen to "+base);button.title=button.getAttribute("aria-label")};sync();new MutationObserver(sync).observe(button,{childList:true,characterData:true,subtree:true});button.addEventListener("whdc-audio-state",sync)}}
function reader(d){if(!d)return '<p>No devotionals yet.</p>';let liked=favs().includes(d.id);return `<div class="reading"><div class="eyebrow">Day ${safe(d.day)} · ${safe((d.topics||[])[0]||'Devotional')}</div><h1>${safe(d.title)}</h1>${readBadge(d.id)}<div class="scripture">${safe(d.contextReferences||d.reference)}</div><div class="card" id="quoteSelectableDevotional"><div class="actions whdc-audio-primary-row whdc-devotional-audio-header"><button class="btn whdc-icon-listen" id="listen" type="button" aria-label="Listen to devotional" title="Listen to devotional">▶ Listen</button><div class="whdc-audio-scope-label" id="whdcAudioScope" role="menu" aria-label="Audio playback options" style="display:none"><button type="button" role="menuitem" data-audio-scope="section">This Section</button><button type="button" role="menuitem" data-audio-scope="all">All</button></div><button type="button" id="whdcPlayAll" hidden aria-label="Play all three devotional sections">Play All</button><label class="whdc-sleep-label" for="whdcSleepTimer">Sleep timer <select id="whdcSleepTimer" aria-label="Stop audio after"><option value="0">Off</option><option value="5">5 min</option><option value="10">10 min</option><option value="15">15 min</option><option value="30">30 min</option></select></label><span id="whdcAudioStatus" class="visually-hidden" role="status" aria-live="polite"></span>${voiceSettings('',[])}</div>${d.mainScriptureText?`<div class="whdc-main-verse"><p><em>${safe(d.mainScriptureText)}</em></p><p class="small muted whdc-main-verse-reference">${safe(mainScriptureReference(d))}${mainScriptureReference(d)?" · WEBU":""}</p></div>`:""}<div class="whdc-quote-text">${para(d.short)}</div><div class="actions"><button class="btn" id="readScripture" type="button" aria-expanded="false" aria-controls="inlineScripture">Read Scripture ↓</button></div><section class="deep hidden" id="inlineScripture" aria-live="polite"></section><div class="actions"><button class="btn primary" id="deeper" aria-expanded="false" aria-controls="deepText">Go Deeper ↓</button></div><section class="deep hidden" id="deepText"><h3>Go Deeper</h3><div class="actions"><button class="btn whdc-icon-listen" id="deeperListen" type="button" aria-label="Listen to Go Deeper" title="Listen to Go Deeper">▶ Listen</button></div><div class="whdc-quote-text">${para(d.deeper)}</div>${d.furtherStudyReferences?.trim()?`<p style="text-align:right;margin-top:1.25rem"><a href="/bible-reader.html?references=${encodeURIComponent(d.furtherStudyReferences)}" class="whdc-further-study-link">Scriptures for Further Study: ${safe(d.furtherStudyReferences.trim())} →</a></p>`:''}<p><a href="#" id="closeDeeperBottom" style="color:inherit;text-decoration:underline;text-underline-offset:3px">Close Section</a></p></section><div class="actions"><button class="btn reflection-btn" id="reflectionToggle" type="button" aria-expanded="false" aria-controls="reflectionText">Questions for Reflection ↓</button></div><section class="deep hidden" id="reflectionText"><h3>Questions for Reflection</h3>${d.reflection?.trim()?para(d.reflection):'<p>Use this space to reflect on what you have read.</p>'}${devotionalJournalForm(d)}<p><a href="#" id="closeReflectionBottom" style="color:inherit;text-decoration:underline;text-underline-offset:3px">Close Section</a></p></section><p class="whdc-author-credit">Written by ${safe(d.author||'Heather Kusunoki')}</p><span id="readingPlanAutoReadEnd" aria-hidden="true" style="display:block;height:1px"></span><div class="actions" role="group" aria-label="Devotional actions"><button class="btn" id="writeReflection" type="button" aria-label="Write a reflection" title="Write a reflection" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:64px;min-height:60px;padding:8px 10px"><span aria-hidden="true" style="font-size:1.35rem;line-height:1.2">✎</span><span aria-hidden="true" style="font-size:.75rem;line-height:1.2;font-weight:500">Reflect</span></button><button class="btn read-toggle" id="markRead" aria-pressed="${!!readDate(d.id)}" aria-label="${readDate(d.id)?'Mark as unread':'Mark as read'}" title="${readDate(d.id)?'Mark as unread':'Mark as read'}" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:64px;min-height:60px;padding:8px 10px"><span aria-hidden="true" style="font-size:1.35rem;line-height:1.2">${readDate(d.id)?'☑':'☐'}</span><span aria-hidden="true" style="font-size:.75rem;line-height:1.2;font-weight:500">Mark Read</span></button><button class="btn" id="favorite" aria-pressed="${liked}" aria-label="${liked?'Remove from saved':'Save devotional'}" title="${liked?'Remove from saved':'Save devotional'}" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:64px;min-height:60px;padding:8px 10px"><span aria-hidden="true" style="font-size:1.35rem;line-height:1.2">${liked?'♥':'♡'}</span><span aria-hidden="true" style="font-size:.75rem;line-height:1.2;font-weight:500">Saved</span></button><button class="btn" id="shareDevotional" type="button" aria-label="Share this devotional" title="Share this devotional" style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:64px;min-height:60px;padding:8px 10px"><span aria-hidden="true" style="font-size:1.35rem;line-height:1.2">↗</span><span aria-hidden="true" style="font-size:.75rem;line-height:1.2;font-weight:500">Share</span></button></div></div>`}
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
  return `<h3>Scripture Reading</h3><div class="actions"><button class="btn whdc-icon-listen" id="scriptureListen" type="button" aria-label="Listen to Scripture" title="Listen to Scripture" ${!scriptureData?'disabled':''}>▶ Listen</button></div>${body}<p class="muted small">World English Bible Updated (WEBU), public domain.</p><div class="actions"><a href="#" id="closeScriptureBottom" style="color:inherit;text-decoration:underline;text-underline-offset:3px">Close Section</a></div>`;
}
function updateScripture(){let panel=$('#inlineScripture'),button=$('#readScripture'),d=current();if(!panel||!button||!d)return;let opened=scriptureOpen&&scriptureForId===d.id;panel.classList.toggle('hidden',!opened);button.setAttribute('aria-expanded',String(opened));button.textContent=opened?'Close ↑':'Read Scripture ↓';if(opened){panel.innerHTML=scriptureMarkup(d);let close=$('#closeScriptureBottom');if(close)close.onclick=e=>{e.preventDefault();scriptureOpen=false;if('speechSynthesis' in window)speechSynthesis.cancel();updateScripture();let top=$('#readScripture');if(top){top.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});top.focus({preventScroll:true})}};let audio=$('#scriptureListen');if(audio)audio.onclick=()=>{if(window.WHDCAudio?.play('scripture',audio))return;if(!('speechSynthesis' in window)){alert('Audio reading is not supported in this browser.');return}if(speechSynthesis.speaking){speechSynthesis.cancel();audio.textContent='▶ Listen';return}if(!scriptureData)return;let u=makeNarration(d.reference+'. '+scriptureData.map(p=>p.reference+'. '+p.verses.map(v=>v.text).join(' ')).join(' '));u.onend=u.onerror=()=>{let b=$('#scriptureListen');if(b)b.textContent='▶ Listen'};speechSynthesis.speak(u);audio.textContent='■ Stop audio'}}}
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
function aboutPage(){return `<style>
.whdc-about{max-width:780px;margin:0 auto 2rem}.whdc-about .whdc-about-story{padding:clamp(22px,5vw,44px);line-height:1.75}.whdc-about h1{margin-bottom:8px}.whdc-about h2{margin:1.6em 0 .55em;font-size:1.35rem}.whdc-about p{max-width:64ch;margin:.75em 0 1.05em}.whdc-about .whdc-about-highlight{font-weight:700;border-left:3px solid #86754a;padding:.3em 0 .3em 15px}.whdc-about-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px}.whdc-about-actions .btn{flex:1 1 150px;text-align:center;justify-content:center;min-height:46px;display:inline-flex;align-items:center}.whdc-about .whdc-about-intro{margin-bottom:20px}@media(max-width:480px){.whdc-about-actions{flex-direction:column}.whdc-about-actions .btn{flex:0 0 auto;width:100%}}
</style><div class="whdc-about"><section class="hero whdc-about-intro" aria-labelledby="aboutTitle"><div class="eyebrow">The heart behind WHDC</div><h1 id="aboutTitle">About Me</h1><p>My story and why I created When Healing Doesn't Come.</p></section><article class="card whdc-about-story"><h2>Hi, I'm Heather!</h2><p>For thirteen years, I worked as a NICU nurse, caring for some of the tiniest and most vulnerable patients. I loved my job, but in November 2021, my life changed when I became sick with Long COVID.</p><p>What I hoped would be a temporary illness became years of fatigue, brain fog, physical limitations, and the loss of so much of the life I once knew.</p><p>I could no longer work as a nurse, and I began wrestling with difficult questions.</p><p><em>How do I trust God when He doesn't answer my prayers the way I hope? Can I still glorify Him when I can do so little? Where do I find joy when my circumstances don't change?</em></p><p>God hasn't healed me the way I've prayed He would, but He continues to meet me in His Word, teaching me to trust His character and find my hope in Jesus rather than my circumstances.</p><h2>Why I Created When Healing Doesn't Come</h2><p>I created <em>When Healing Doesn't Come</em> for people who are suffering and wondering how to keep trusting God when life doesn't get better.</p><p>I also wanted to create something that was accessible on both good days and bad days.</p><p>Because of Long COVID, I sometimes struggle to read or understand what I'm reading. On particularly difficult days, even opening and holding a book can be exhausting.</p><p class="whdc-about-highlight">And yet, those are often the days when I most need to be reminded of God's truth.</p><p>That's why this app includes short devotionals, audio narration, adjustable text, and easy access to Scripture. Whether you have the energy for deeper study or can only listen for a few minutes while resting in bed, my hope is that God's Word will be accessible to you.</p><p>I'm still learning to trust God in the middle of suffering. I don't write as someone who has all the answers, but as someone who needs these reminders just as much as you do.</p><p>My prayer is that this app helps you know God more deeply, trust His character, and remember that <strong>even when healing doesn't come, Jesus is still enough.</strong></p><p>Thank you for being here!</p><h2>Connect &amp; Support</h2><div class="whdc-about-actions"><button type="button" class="btn primary" data-nav="support">♡ Donate</button><button type="button" class="btn" data-nav="contact">✉ Contact</button><button type="button" class="btn" id="aboutShareApp">↗ Share App</button></div></article></div>`}
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
 section.hidden=false;clearWHDCBadge('announcement');
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
function clearWHDCBadge(type){if(!('serviceWorker' in navigator))return;navigator.serviceWorker.ready.then(r=>{const worker=navigator.serviceWorker.controller||r.active;worker?.postMessage({type:'WHDC_BADGE_CLEAR',badgeType:type});}).catch(()=>{});}
const HOME_FEATURES_SEEN_KEY='whdc-home-features-seen-v1';
function openOurChoice(){
 // A choice for readers who do not have the energy to choose a topic.
 const choices=data.filter(d=>d&&d.id&&d.short);
 if(!choices.length){alert('There are no devotionals available yet. Please try again later.');return;}
 const previous=sessionStorage.getItem('whdc-our-choice-last');
 const pool=choices.length>1?choices.filter(d=>d.id!==previous):choices;
 const picked=pool[Math.floor(Math.random()*pool.length)];
 sessionStorage.setItem('whdc-our-choice-last',picked.id);setTopicReading(picked.id);
 activeReadingPlan='';currentId=picked.id;scriptureOpen=false;scriptureForId=null;view='today';
 rememberOpenDevotional(currentId);render();scrollTo(0,0);
}
function homeFeatureSections(){
 const firstVisit=localStorage.getItem(HOME_FEATURES_SEEN_KEY)!=='1';
 const features=[
  ['Daily Devotionals','Biblical encouragement at your own pace',`<p>Find biblical encouragement through thoughtful devotionals that address suffering, identity, faith, waiting, and trusting God when life doesn't go as planned.</p><p>Each devotional is intentionally designed to meet you where you are, without overwhelming you. Some days you may have very little physical or mental energy, while other days you may have the strength and desire to spend more time in God's Word.</p><p><strong>On the hard days,</strong> simply read the Key Scripture or spend a few minutes with the Short Devotional. <strong>On days when you have more energy,</strong> explore Go Deeper for an in-depth biblical study, read the Scripture passage in its broader context, or spend time with reflection questions.</p><p>There's no pressure to complete everything or keep up with a particular pace. Read what you can, when you can.</p>`],
  ['Listen Along','Listen when reading feels difficult',`<p>On days when reading feels difficult, you can listen instead. Use the speaker icons to listen to the Short Devotional, Go Deeper study, or Scripture Reading. The first speaker also offers Play All, which plays the three sections in order. During playback, open the compact audio controls to adjust voice, speed, or the Sleep Timer.</p><p>I'm gradually adding AI-generated narration with warm, natural-sounding voices to replace the built-in device readers. As recordings become available, you can choose voices and adjust listening speed. Until then, the app continues using your device's built-in reader so you can still listen to every devotional.</p>`],
  ['Read and Study the Bible','Explore Scripture with inductive study tools',`<p>Explore the World English Bible Updated with a built-in Bible reader. Search for words, verses, and passages, or follow Scripture references directly from devotionals to read them in context.</p><p>The Bible Reader remembers your reading position on this device, so you can pick up where you left off. It also includes <strong>inductive Bible study tools</strong> to highlight, underline, and circle words or passages. Save favorite verses and add personal study notes.</p><p>These tools work on mobile devices, but you may find them especially helpful on an iPad or larger screen, where there's more room to read and mark up Scripture.</p><p><strong>Make the Bible Reader your own:</strong> use the reader settings gear to adjust Scripture text size, switch between paragraph and verse-by-verse reading, choose continuous chapters or separated chapters, and change the size of chapter and verse numbers. You can also switch between light and dark reading themes and download the complete Bible for offline reading.</p>`],
  ['Journal Your Journey','Reflections, prayers, and answered prayers',`<p>Use reflection questions to process what you're learning, record your thoughts in a personal journal, and keep track of prayer requests and answered prayers.</p>`],
  ['Save What Encourages You','Keep meaningful verses, quotes, and devotionals',`<p>Keep your favorite verses, meaningful quotes, and devotionals together so you can return to them whenever you need encouragement.</p>`],
  ['Grow at Your Own Pace','Reading plans, progress, and gentle reminders',`<p>Follow devotional reading plans, explore topics that speak to your circumstances, and track your reading progress. When you open a devotional from Topics, the Read shortcut lets you return to it while you explore other parts of the app. You can also set optional daily reminders to help make time in God's Word part of your routine.</p>`],
  ['Make the App Your Own','Personalize reading, listening, navigation, and reminders',`<p>Open <strong>Settings</strong> to choose which page opens when you launch the app and customize the four shortcuts in your mobile navigation bar.</p><p>Adjust devotional text size (80–150%) and choose a light, dark, or system-matched appearance. Accessibility options include dyslexia-friendly fonts and spacing, reduced motion, higher contrast, and simplified reading. Select your preferred AI narration voice or built-in device voice, and set your default listening speed.</p><p>Download devotionals for offline reading, or remove downloads when you no longer need them. You can also turn notifications on or off, choose which announcements and reminders you receive, and set your preferred times and days for devotional, reading plan, and Scripture memory reminders.</p><p>Your preferences are saved on this device, so you can change them whenever your needs change. The Bible Reader also has its own reading and display settings, described above.</p>`]
 ];
 // Save immediately on the first homepage render, even if the visitor never expands a section.
 if(firstVisit)localStorage.setItem(HOME_FEATURES_SEEN_KEY,'1');
 return `<section class="whdc-home-features" aria-labelledby="whdcFeaturesHeading"><h2 id="whdcFeaturesHeading">Explore What's Inside</h2><p>Open any feature to learn more about the tools available to you.</p>${features.map(([title,subtitle,body])=>`<details class="whdc-home-feature" ${firstVisit?'open':''}><summary><span class="whdc-home-feature-label"><strong>${title}</strong><small>${subtitle}</small></span><span class="whdc-home-feature-chevron" aria-hidden="true">⌄</span></summary><div class="whdc-home-feature-body">${body}</div></details>`).join('')}</section>`;
}

let whdcResources=[],whdcResourcesLoaded=false,whdcResourceOpen=null,whdcResourceSearch='',whdcResourceTopic='',whdcBookModalId=null;
const whdcResourceSections=[['article','articles','Articles','file-text'],['book','books','Books','library-big'],['podcast','podcasts','Podcasts','headphones'],['website','websites','Websites','globe']];
function whdcResourceIcon(type){const paths={article:'<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>',book:'<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v15c-3-1-6-1-9 1-3-2-6-2-9-1zM12 6v15"/>',podcast:'<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 14h4v7H6a2 2 0 0 1-2-2zM20 14h-4v7h2a2 2 0 0 0 2-2z"/>',website:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/>'};return '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[type]+'</svg>'}
function resourcesPage(){if(whdcResourceOpen){const r=whdcResources.find(x=>x.id===whdcResourceOpen);if(!r)return '<p>Resource unavailable.</p>';let bookmarked=[];try{bookmarked=JSON.parse(localStorage.getItem('whdc-saved-resources-v1')||'[]')}catch{}return `<section class="whdc-resource-detail"><button class="btn" type="button" data-resource-back>← All Resources</button>${r.image_url?`<img class="whdc-resource-cover" src="${safe(r.image_url)}" alt="">`:''}<p class="muted">${safe(r.type)}</p><h1>${safe(r.title)}</h1>${r.creator?`<p>${safe(r.creator)}</p>`:''}<p>${safe(r.description||'')}</p><div class="actions"><button class="btn" data-resource-save="${safe(r.id)}">${bookmarked.includes(r.id)?'Remove bookmark':'Save for Later'}</button><button class="btn" data-resource-share>Share</button>${r.url?`<a class="btn" href="${safe(r.url)}" target="_blank" rel="noopener noreferrer">Open Link ↗</a>`:''}</div>${r.type==='article'?`<div class="whdc-resource-article">${String(r.content||'').split(/\n\s*\n/).map(t=>'<p>'+safe(t).replace(/\n/g,'<br>')+'</p>').join('')}</div>`:''}</section>`}
const topics=[...new Set(whdcResources.flatMap(r=>r.topics||[]))].sort();const query=whdcResourceSearch.toLowerCase();const filtered=whdcResources.filter(r=>(!whdcResourceTopic||(r.topics||[]).includes(whdcResourceTopic))&&(!query||[r.title,r.creator,r.description,r.content,...(r.topics||[])].join(' ').toLowerCase().includes(query)));return `<section class="whdc-resources"><p>Articles, books, podcasts, and websites offering biblical encouragement and practical guidance.</p><nav class="whdc-resource-jump" aria-label="Resource sections">${whdcResourceSections.map(([type,id,label])=>`<a href="#${id}" data-resource-jump="${id}">${whdcResourceIcon(type)}<span>${label}</span></a>`).join('')}</nav><label for="whdc-resource-search">Search resources</label><input id="whdc-resource-search" type="search" value="${safe(whdcResourceSearch)}" placeholder="Search resources"><label for="whdc-resource-topic">Topic</label><select id="whdc-resource-topic"><option value="">All topics</option>${topics.map(t=>`<option value="${safe(t)}" ${whdcResourceTopic===t?'selected':''}>${safe(t)}</option>`).join('')}</select><p class="muted">${whdcResourcesLoaded?filtered.length+' resources':'Loading resources…'}</p>${whdcResourceSections.map(([type,id,label])=>`<section class="whdc-resource-section" id="resource-${id}"><h2>${label}</h2><div class="${type==='book'?'whdc-book-grid':'grid'}">${filtered.filter(r=>r.type===type).map(r=>type==='book'?`<button class="whdc-book-tile" type="button" data-resource-book="${safe(r.id)}">${r.image_url?`<img class="whdc-book-cover" src="${safe(r.image_url)}" loading="lazy" alt="">`:`<span class="whdc-book-cover whdc-book-placeholder">📖</span>`}<strong>${safe(r.title)}</strong>${r.creator?`<span class="whdc-book-author">${safe(r.creator)}</span>`:''}</button>`:`<button class="card whdc-resource-card" type="button" data-resource-open="${safe(r.id)}">${r.image_url?`<img src="${safe(r.image_url)}" loading="lazy" alt="">`:''}<strong>${safe(r.title)}</strong>${r.creator?`<span>${safe(r.creator)}</span>`:''}<span>${safe(r.description||'')}</span></button>`).join('')||`<p>No matching ${label.toLowerCase()}.</p>`}</div></section>`).join('')}${whdcResourceBookModal()}</section>`}
function whdcResourceBookModal(){if(!whdcBookModalId)return '';const r=whdcResources.find(x=>x.id===whdcBookModalId&&x.type==='book');if(!r)return '';return `<div class="whdc-book-overlay" data-book-overlay><div class="whdc-book-dialog" role="dialog" aria-modal="true" aria-labelledby="whdc-book-title"><button class="whdc-book-close" type="button" data-book-close aria-label="Close">×</button>${r.image_url?`<img class="whdc-book-dialog-cover" src="${safe(r.image_url)}" alt="">`:''}<h2 id="whdc-book-title">${safe(r.title)}</h2>${r.creator?`<p class="whdc-book-author">${safe(r.creator)}</p>`:''}<div class="whdc-book-body">${String(r.content||r.description||'').split(/\n\s*\n/).map(t=>`<p>${safe(t).replace(/\n/g,'<br>')}</p>`).join('')}</div>${r.url?`<a class="btn" href="${safe(r.url)}" target="_blank" rel="noopener noreferrer">View Book ↗</a>`:''}</div></div>`}
function wireResources(){if(view!=='resources')return;document.querySelectorAll('[data-resource-book]').forEach(b=>b.onclick=()=>{whdcBookModalId=b.dataset.resourceBook;render();document.querySelector('[data-book-close]')?.focus()});document.querySelector('[data-book-close]')?.addEventListener('click',()=>{whdcBookModalId=null;render()});document.querySelector('[data-book-overlay]')?.addEventListener('click',e=>{if(e.target===e.currentTarget){whdcBookModalId=null;render()}});document.querySelectorAll('[data-resource-jump]').forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById('resource-'+a.dataset.resourceJump)?.scrollIntoView({behavior:'smooth',block:'start'})});const search=document.getElementById('whdc-resource-search');if(search)search.oninput=()=>{whdcResourceSearch=search.value;const start=search.selectionStart;const end=search.selectionEnd;render();const fresh=document.getElementById('whdc-resource-search');fresh?.focus();fresh?.setSelectionRange(start,end)};const topic=document.getElementById('whdc-resource-topic');if(topic)topic.onchange=()=>{whdcResourceTopic=topic.value;render()};document.querySelectorAll('[data-resource-open]').forEach(b=>b.onclick=()=>{whdcResourceOpen=b.dataset.resourceOpen;render();scrollTo(0,0)});document.querySelector('[data-resource-back]')?.addEventListener('click',()=>{whdcResourceOpen=null;render()});document.querySelector('[data-resource-save]')?.addEventListener('click',e=>{const id=e.currentTarget.dataset.resourceSave;let arr=[];try{arr=JSON.parse(localStorage.getItem('whdc-saved-resources-v1')||'[]')}catch{}const set=new Set(arr);set.has(id)?set.delete(id):set.add(id);localStorage.setItem('whdc-saved-resources-v1',JSON.stringify([...set]));render()});document.querySelector('[data-resource-share]')?.addEventListener('click',async()=>{const r=whdcResources.find(x=>x.id===whdcResourceOpen);const url=location.origin+'/#resources';if(navigator.share)try{await navigator.share({title:r?.title||'Resources',url})}catch{}else if(navigator.clipboard)await navigator.clipboard.writeText(url)});if(!whdcResourcesLoaded){whdcResourcesLoaded=true;fetch('/api/resources',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Unable to load resources');return r.json()}).then(items=>{whdcResources=Array.isArray(items)?items:[];if(view==='resources')render()}).catch(()=>{whdcResourcesLoaded=false;const el=document.querySelector('.whdc-resources .muted');if(el)el.textContent='Resources could not be loaded. Please try again.'})}}
function render(){window.WHDCBibleComponent?.beforeRender();window.dispatchEvent(new Event('whdc-appearance-changed'));document.body.querySelector(':scope > .whdc-alert-wrap')?.remove();preserveJournalSections();if(view==='today')clearWHDCBadge('daily');if(view==='plans'||view==='plan-detail')clearWHDCBadge('plan');document.getElementById("saveQuoteSelection")?.remove();stopPlanAutoRead();addExploreStyles();let allTopics=['All',...new Set(data.flatMap(d=>(d.topics||[]).map(t=>String(t).trim()).filter(Boolean)))].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b));if(selectedTopic!=='All'&&!allTopics.includes(selectedTopic))selectedTopic='All';let body=view==='bible'?'<section id="whdcBibleMount" aria-label="Bible Reader"><p role="status">Loading Bible Reader…</p></section>':view==='home'?`<section id="whdcAnnouncement" class="whdc-announcement" hidden aria-label="What's New"><h2 id="whdcAnnouncementTitle"></h2><div id="whdcAnnouncementBody"></div></section><section class="hero home-hero"><button class="whdc-home-share-icon" id="shareThisApp" type="button" aria-label="Share When Healing Doesn't Come app" title="Share app"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.6 6.6-4.2M8.7 13.4l6.6 4.2"/></svg><span>Share App</span></button><h2>Devotions for Life's Hardest Seasons</h2><p>Living with chronic illness, pain, grief, or circumstances that don't change can leave us wrestling with difficult questions about God, suffering, and hope.</p><p><em>When Healing Doesn't Come</em> is a free, Scripture-centered devotional app created to help you draw closer to God in the middle of life's hardest seasons. Whether you're searching for encouragement, struggling with unanswered prayers, or simply longing to spend time in God's Word, you'll find a place to reflect, learn, and grow in faith.</p></section><section class="home-topics whdc-home-start" aria-labelledby="exploreHeading"><h2 id="exploreHeading">Find a Place to Begin</h2><p>Browse devotionals by topic, or read today's Devotion of the Day. If choosing feels overwhelming, you can find <strong>Our Choice</strong> in the Topics section, where we'll select a devotional for you.</p><div class="actions whdc-start-actions"><button class="btn home-explore-button" data-nav="topics" type="button">Topics</button><button class="btn" data-nav="today" type="button">Today</button></div></section>${homeFeatureSections()}<section class="whdc-meet-creator" aria-labelledby="whdcMeetCreatorTitle"><img class="whdc-creator-photo" src="/images/meet-the-creator.png" alt="Heather, creator of When Healing Doesn’t Come" width="144" height="144" loading="lazy" onerror="this.style.visibility='hidden'"><div class="whdc-creator-copy"><h2 id="whdcMeetCreatorTitle">Meet the Creator</h2><p>Discover the heart behind <em>When Healing Doesn't Come</em>. Through her own journey with chronic illness, Heather was inspired to create a place of hope and encouragement for both the good days and the hard ones.</p><button type="button" class="btn" data-nav="about">Read Heather's Story →</button></div></section><section class="home-divider" role="img" aria-label="Misty mountain landscape" style="min-height:205px;margin:2.8rem 0 3rem;border-radius:18px;overflow:hidden;background:#dce6df url('/images/misty-mountain-divider.jpg') center 58% / cover no-repeat"></section>`:view==='today'?`<section class="home-reading" id="todayPickSection" data-whdc-devotional-id="${safe(current()?.id||'')}" aria-labelledby="featuredHeading">${location.hash.startsWith('#devotional/')?'':'<h1 id="featuredHeading" class="today-featured-heading"><img class="today-featured-banner" src="/images/todays-pick-banner.png" alt="Today’s Pick, misty mountains at sunrise" /></h1>'}${planReaderNavigation()}${reader(current())}${planReaderFooter()}</section><section class="home-more"><h2>Explore by topic</h2><p>Choose a topic to find devotionals for what you’re walking through.</p><div class="topics">${allTopics.filter(t=>t!=='All').map(t=>`<button class="chip" type="button" data-home-topic="${safe(t)}">${safe(t)}</button>`).join('')}</div></section>`:view==='study-guide'?studyGuidePage():view==='saved-quotes'?savedQuotesPage():view==='favorite-verses'?favoriteVersesPage():view==='journal'?journalPage():view==='milestones'?`<section class="hero"><div class="eyebrow">At your own pace</div><h1>Reading Milestones</h1><p>A quiet place to reflect on time spent in Scripture. No streaks or deadlines.</p></section>${readingMilestones()}`:view==='plans'?planOverview():view==='plan-complete'?(planItems().find(p=>p.id===selectedReadingPlan)?planCompletionMessage(planItems().find(p=>p.id===selectedReadingPlan)):planOverview()):view==='plan-detail'?planDetail():view==='explore'?`<section class="hero whdc-explore-heading"><div class="eyebrow">Find encouragement</div><h1>Explore</h1><p>There’s more to discover! Explore the tools and features available to help you engage with Scripture, reflect on what God is teaching you, and grow in your walk with Him.</p></section><section class="whdc-explore-hub" aria-label="Explore WHDC"><button type="button" class="whdc-explore-feature" data-nav="topics"><span class="whdc-explore-symbol" aria-hidden="true">☷</span><span class="whdc-explore-copy"><strong>Browse by Topic</strong><small>Find devotionals by theme</small></span><span class="whdc-explore-arrow" aria-hidden="true">›</span></button><div class="whdc-explore-grid"><button type="button" class="whdc-explore-tile" data-nav="resources"><span class="whdc-explore-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h2v16H6a2 2 0 0 0-2 2"/><path d="M8 5h5v14H8z"/><path d="m14 5 4-1 3 14-4 1z"/><path d="M3 21h18"/></svg></span><strong>Resources</strong><small>Articles, books, websites &amp; podcasts</small></button><button type="button" class="whdc-explore-tile" data-nav="plans"><span class="whdc-explore-symbol" aria-hidden="true">▤</span><strong>Reading Plans</strong><small>Series & guided plans</small></button><button type="button" class="whdc-explore-tile" data-nav="journal"><span class="whdc-explore-symbol" aria-hidden="true">✎</span><strong>My Journal</strong><small>Prayers & reflections</small></button><button type="button" class="whdc-explore-tile" data-nav="study-guide"><span class="whdc-explore-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:auto"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z"/></svg></span><strong>Inductive Bible Study</strong><small>Study guide &amp; notes</small></button><button type="button" class="whdc-explore-tile" data-nav="saved"><span class="whdc-explore-symbol" aria-hidden="true">☆</span><strong>Saved Devotionals</strong><small>Your favorites</small></button><button type="button" class="whdc-explore-tile" data-nav="history"><span class="whdc-explore-symbol" aria-hidden="true">◷</span><strong>Reading Log</strong><small>Previously read</small></button><button type="button" class="whdc-explore-tile" data-nav="support"><span class="whdc-explore-symbol" aria-hidden="true">♡</span><strong>Donate</strong><small>Support WHDC</small></button><button type="button" class="whdc-explore-tile" data-nav="contact"><span class="whdc-explore-symbol" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span><strong>Contact</strong><small>Get in touch</small></button></div></section>`:view==='resources'?resourcesPage():view==='topics'?`<section class="hero"><div class="eyebrow">Find what you need</div><h1>Browse by topic</h1><p>Choose a topic that speaks to what you are walking through. If choosing feels overwhelming today, select <strong>Our Choice</strong> and we will randomly pick a devotional for you. There is no need to decide.</p></section><div class="whdc-our-choice-row"><button class="btn primary whdc-our-choice-button" type="button" data-our-choice>Our Choice</button></div><div class="topics">${allTopics.map(t=>`<button class="chip ${selectedTopic===t?'active':''}" data-topic="${safe(t)}">${safe(t)}</button>`).join('')}</div><div id="whdcTopicResults" class="grid" style="scroll-margin-top:100px">${data.filter(d=>selectedTopic==='All'||(d.topics||[]).includes(selectedTopic)).map(card).join('')||'<p>No published devotionals in this topic yet. More are being prepared.</p>'}</div>`:view==='history'?`<section class="hero"><div class="eyebrow">Your reading journey</div><h1>Reading Log</h1><p>Revisit the devotionals you've read, and see when you last marked each one as read. There's no schedule to keep up with.</p></section><p class="muted small">${data.filter(d=>readDate(d.id)).length} of ${data.length} published devotionals marked as read on this device.</p><div class="grid">${data.filter(d=>readDate(d.id)).sort((a,b)=>String(readDate(b.id)).localeCompare(String(readDate(a.id)))||String(a.title).localeCompare(String(b.title))).map(card).join('')||'<div class="empty">No readings marked as read yet. Open a devotional and select “Mark as read” to begin your history.</div>'}</div><p class="muted small">Your reading history is stored in this browser, not in an account. It may not appear on other devices and can be lost if browser data is cleared.</p>`:view==='about'?aboutPage():view==='support'?supportPage():view==='contact'?contactPage():view==='saved'?`<section class="hero"><div class="eyebrow">Your quiet space</div><h1>Saved Devotionals</h1><p>Return whenever you like. No streaks and no missed days.</p></section><div class="grid">${data.filter(d=>favs().includes(d.id)).map(card).join('')||'<div class="empty">Nothing saved yet. Open a devotional and tap “Save for later.”</div>'}</div>`:view==='settings'?collapsedSettings(openingSettings()+bottomNavigationSettings()+readingAppearanceSettings()+accessibilitySettings()+audioReadingSettings()+offlineReadingSettings()+notificationSettings())+`<section class="card" style="max-width:760px;margin:14px auto"><h2>About this app</h2><p>Read my story and why I created When Healing Doesn't Come.</p><button class="btn" type="button" data-nav="about">About Me →</button></section>`:admin();$('#app').innerHTML=`<header><div class="wrap top whdc-header-top"><a class="brand" href="#home" aria-label="When Healing Doesn't Come, home"><img class="header-logo" src="/images/header-logo.png" alt="When Healing Doesn't Come"></a><div class="whdc-alert-wrap" hidden><button class="whdc-alert-bell" type="button" id="whdcAlertBell" aria-label="Notifications" aria-expanded="false" aria-controls="whdcAlertPanel" title="Notifications"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg><span id="whdcAlertDot" class="whdc-alert-dot" hidden></span></button><section id="whdcAlertPanel" class="whdc-alert-panel" aria-label="Notifications" hidden><div class="whdc-alert-head"><strong>Notifications</strong><button type="button" class="whdc-alert-close" id="whdcAlertClose" aria-label="Close">✕</button></div><div id="whdcAlertList" aria-live="polite">Checking alerts…</div><div class="whdc-alert-actions"><button type="button" class="btn" id="whdcAlertClear">✓ Clear</button><button type="button" class="btn whdc-alert-settings-button" id="whdcAlertSettings" aria-label="Notification settings"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.9 1.9-.06-.06A1.7 1.7 0 0 0 16 18.4a1.7 1.7 0 0 0-1 .75V21h-2.7v-.08a1.7 1.7 0 0 0-1.1-1.57 1.7 1.7 0 0 0-1.83.4l-.06.06-1.9-1.9.06-.06A1.7 1.7 0 0 0 7.6 16a1.7 1.7 0 0 0-.75-1H5v-2.7h.08a1.7 1.7 0 0 0 1.57-1.1 1.7 1.7 0 0 0-.4-1.83l-.06-.06 1.9-1.9.06.06A1.7 1.7 0 0 0 10 7.6a1.7 1.7 0 0 0 1-.75V5h2.7v.08a1.7 1.7 0 0 0 1.1 1.57 1.7 1.7 0 0 0 1.83-.4l.06-.06 1.9 1.9-.06.06A1.7 1.7 0 0 0 18.4 10a1.7 1.7 0 0 0 .75 1H21v2.7h-.08A1.7 1.7 0 0 0 19.4 15Z" transform="translate(-.6 -.6) scale(1.05)"/></svg><span>Settings</span></button></div></section></div><button class="btn whdc-menu-button" id="menuToggle" type="button" aria-controls="mainMenu" aria-expanded="false" aria-label="Toggle navigation menu" title="Menu"><span class="whdc-menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button><nav id="mainMenu" class="whdc-nav" aria-label="Main navigation" hidden></nav></div></header><main class="wrap">${body}</main><footer class="footer"><div class="wrap" style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px 28px;flex-wrap:wrap"><div style="flex:1 1 340px">&copy; 2026 When Healing Doesn't Come · Hope for the Journey<p class="muted small">Scripture reading uses the public-domain World English Bible USA (Updated, LORD) (WEBU).</p></div><div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;padding-top:2px"><a href="/get-app.html" id="shareAppFooter" class="get-app-footer-link">Share App</a><a href="/admin" target="_blank" rel="noopener noreferrer" class="get-app-footer-link">Login</a></div></div></footer>`;addAppStyles();const alertWrap=document.querySelector('.whdc-alert-wrap');if(alertWrap&&view==='settings'){alertWrap.remove()}else if(alertWrap){document.body.appendChild(alertWrap)}window.WHDCNav.render(document.getElementById('mainMenu'),view,true);syncTopicReadingNav();const previousClose=document.getElementById('whdcTopicClose');if(previousClose)previousClose.remove();if(view==='today'&&selectedTopicReading()===currentId){const close=document.createElement('button');close.id='whdcTopicClose';close.type='button';close.textContent='×';close.setAttribute('aria-label','Close selected devotional and return to Explore');close.title='Close selected devotional';close.onclick=closeTopicReading;document.body.append(close)}wireMenu();wireAlertCenter();document.getElementById('shareAppFooter')?.addEventListener('click',e=>{e.preventDefault();shareThisApp();});wirePlans();wireJournal();wireFavoriteVerses();wireSavedQuotes();wireStudyGuide();wireResources();linkDevotionalScriptureReferences();wireDevotionalQuoteSelection();document.getElementById('writeReflection')?.addEventListener('click',startDevotionalReflection);wirePlanReaderNavigation();wirePlanAutoRead();wirePlanCompletion();if(view==='home'){loadHomeAnnouncement();const shareAppButton=document.getElementById('shareThisApp');if(shareAppButton)shareAppButton.addEventListener('click',shareThisApp);}if(view==='about')document.getElementById('aboutShareApp')?.addEventListener('click',shareThisApp);if(view==='settings'){wireOpeningSettings();wireBottomNavigationSettings();wireNotificationSettings();wireReadingAppearanceSettings();wireAccessibilitySettings();wireVoiceSettings('settings');wireOfflineReadingSettings();}if(view==='contact'){
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
};if(view==='bible'){const mount=document.getElementById('whdcBibleMount');if(window.WHDCBibleComponent?.mount){window.WHDCBibleComponent.mount(mount)}else if(mount){mount.innerHTML='<p role="alert">Bible component JavaScript did not load. <a href="/bible-reader.html">Open the standalone Bible Reader</a>.</p>'}};const homeBrand=document.querySelector('.brand');if(homeBrand)homeBrand.onclick=e=>{e.preventDefault();nav('home')};document.querySelectorAll('button[data-nav]').forEach(b=>b.onclick=()=>nav(b.dataset.nav));document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{if(view==='plan-detail'){openFromReadingPlan(b.dataset.open,selectedReadingPlan);return}if(view==='topics'||view==='explore'){setTopicReading(b.dataset.open);}activeReadingPlan='';currentId=b.dataset.open;scriptureOpen=false;scriptureForId=null;view='today';rememberOpenDevotional(currentId);render();scrollTo(0,0)});document.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{selectedTopic=b.dataset.topic;render();requestAnimationFrame(()=>{const results=document.getElementById('whdcTopicResults');if(results)results.scrollIntoView({behavior:'smooth',block:'start'});});});document.querySelectorAll('[data-our-choice]').forEach(b=>b.onclick=openOurChoice);document.querySelectorAll('[data-home-topic]').forEach(b=>b.onclick=()=>{selectedTopic=b.dataset.homeTopic;nav('topics')});if(view==='today'&&current()){$('#readScripture').onclick=()=>toggleScripture(current());updateScripture();let b=$('#deeper');b.onclick=()=>{let e=$('#deepText'),open=e.classList.toggle('hidden')===false;b.setAttribute('aria-expanded',String(open));b.textContent=open?'Close ↑':'Go Deeper ↓';let close=$('#closeDeeperBottom');if(close)close.onclick=e=>{e.preventDefault();e.target.closest('#deepText').classList.add('hidden');b.setAttribute('aria-expanded','false');b.textContent='Go Deeper ↓';b.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});b.focus({preventScroll:true})}};let deeperAudio=$('#deeperListen');if(deeperAudio)deeperAudio.onclick=()=>{if(window.WHDCAudio?.play('deeper',deeperAudio))return;if(!('speechSynthesis' in window)){alert('Audio reading is not supported in this browser.');return}if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();document.querySelectorAll('#listen,#scriptureListen,#deeperListen').forEach(el=>{el.textContent=el.id==='listen'?'▶ Listen':el.id==='scriptureListen'?'▶ Listen':'▶ Listen'});return}let d=current();if(!d||!d.deeper)return;let u=makeNarration('Go Deeper. '+d.deeper);u.onend=u.onerror=()=>{let b=$('#deeperListen');if(b)b.textContent='▶ Listen'};speechSynthesis.speak(u);deeperAudio.textContent='■ Stop audio'};let reflectionButton=$('#reflectionToggle');if(reflectionButton){reflectionButton.onclick=()=>{let e=$('#reflectionText'),open=!e.classList.toggle('hidden');reflectionButton.setAttribute('aria-expanded',String(open));reflectionButton.textContent=open?'Close ↑':'Questions for Reflection ↓'};let reflectionClose=$('#closeReflectionBottom');if(reflectionClose)reflectionClose.onclick=e=>{e.preventDefault();$('#reflectionText').classList.add('hidden');reflectionButton.setAttribute('aria-expanded','false');reflectionButton.textContent='Questions for Reflection ↓';reflectionButton.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});reflectionButton.focus({preventScroll:true})}};$('#markRead').onclick=()=>{if(activeReadingPlan){if(readDate(current().id))planManualUnreadThisSession.add(activeReadingPlan+'::'+current().id);afterPlanReadingMarked(current().id)}else{toggleRead(current().id);syncPlanCompletions();render()}};$('#favorite').onclick=()=>{let f=favs();f=f.includes(currentId)?f.filter(x=>x!==currentId):[...f,currentId];saveFavs(f);render()};$('#shareDevotional').onclick=()=>shareDevotional(current());wireVoiceSettings();wireWHDCIconListenButtons();window.WHDCAudioDock?.attach();document.getElementById('whdcPlayAll')?.addEventListener('click',()=>{const d=current();window.WHDCAudio?.playAll(async part=>{if(part==='devotional')return [d.title,d.reference,d.short].filter(Boolean).join('. ');if(part==='deeper')return d.deeper||'';const refs=scriptureSections(d);const sections=d.contextPassages?.length===refs.length?d.contextPassages:await Promise.all(refs.map(async reference=>{const r=await fetch('/api/scripture?reference='+encodeURIComponent(reference));if(!r.ok)throw Error('Scripture unavailable');return r.json()}));return refs.map((ref,i)=>ref+'. '+(sections[i]?.verses||[]).map(v=>typeof v==='string'?v:(v.text||'')).join(' ')).join(' ')});});document.getElementById('whdcSleepTimer')?.addEventListener('change',e=>window.WHDCAudio?.setSleep(Number(e.target.value)));const loadedDevotionalId=current().id;window.WHDCAudio?.load(loadedDevotionalId).then(()=>{if(current()?.id!==loadedDevotionalId||!$('#voiceChoice'))return;window.WHDCAudio?.decorate();const voices=devotionalRecordedVoices(),select=$('#voiceChoice');const preferred=preferredAIVoice(),active=selectedReadingVoice();const chosen=voices.includes(active.slice(9))&&active.startsWith('recorded:')?active.slice(9):voices.includes(preferred)?preferred:voices.includes('sulafat')?'sulafat':voices[0];const temp=document.createElement('div');temp.innerHTML=voiceSettings('',voices);const replacement=temp.querySelector('select');select.replaceChildren(...Array.from(replacement.options).map(o=>o.cloneNode(true)));if(voices.length){select.value='recorded:'+chosen;localStorage.setItem(VOICE_KEY,'recorded:'+chosen)}else{select.value=localStorage.getItem(DEVICE_VOICE_KEY)||'';}});$('#listen').onclick=()=>{if(window.WHDCAudio?.play('devotional',$('#listen')))return;if(!('speechSynthesis' in window)){alert('Audio reading is not supported in this browser.');return}const button=$('#listen');if(speechSynthesis.speaking){speechSynthesis.cancel();button.textContent='▶ Listen';return}const spoken=current();if(!spoken)return;const utterance=makeNarration([spoken.title,spoken.reference,spoken.short].join('. '));utterance.onend=()=>{const el=$('#listen');if(el)el.textContent='▶ Listen'};utterance.onerror=()=>{const el=$('#listen');if(el)el.textContent='▶ Listen'};speechSynthesis.speak(utterance);button.textContent='■ Stop audio'};const scope=$('#whdcAudioScope');if(scope){const icon=$('#listen');const playSection=icon.onclick;const hideScope=()=>{scope.style.display='none';icon.setAttribute('aria-expanded','false')};icon.setAttribute('aria-haspopup','menu');icon.setAttribute('aria-expanded','false');icon.setAttribute('aria-controls','whdcAudioScope');icon.onclick=()=>{const opening=scope.style.display==='none';scope.style.display=opening?'flex':'none';icon.setAttribute('aria-expanded',String(opening));if(opening)scope.querySelector('button')?.focus()};scope.querySelectorAll('[data-audio-scope]').forEach(option=>option.addEventListener('click',()=>{const choice=option.dataset.audioScope;hideScope();if(choice==='all'){$('#whdcPlayAll')?.click()}else playSection()}));scope.addEventListener('keydown',e=>{if(e.key==='Escape'){hideScope();icon.focus()}});document.addEventListener('click',e=>{if(!icon.isConnected)return;if(!icon.contains(e.target)&&!scope.contains(e.target))hideScope()})}}if(view==='admin')wireAdmin()}
window.addEventListener('popstate',()=>{window.dispatchEvent(new Event('hashchange'))});window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);const match=/^devotional\/(.+)$/.exec(next);if(match){let id='';try{id=decodeURIComponent(match[1])}catch{}if(data.some(d=>d.id===id)){currentId=id;view='today';sessionStorage.setItem(OPEN_DEVOTIONAL_KEY,id);render();return}}if(['home','today','explore','resources','topics','saved','history','plans','milestones','plan-detail','support','contact','about','settings','bible'].includes(next)){if(!selectedTopicReading())clearOpenDevotional();view=next;if(next==='today')currentId=dailyPick(data)?.id;render()}});function wireAdmin(){$('#new').onclick=()=>showEditor(null);document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>showEditor(data.find(d=>d.id===b.dataset.edit)));$('#export').onclick=()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='content.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};$('#import').onchange=async e=>{let file=e.target.files[0];if(!file)return;try{let imported=JSON.parse(await file.text());validate(imported);if(confirm('Replace all local devotionals with this imported file?')){data=imported;localStorage.setItem(KEY,JSON.stringify(data));render()}}catch(err){alert('Could not import: '+err.message)}}}
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
 }catch(err){$('#app').innerHTML='<main class="wrap"><h1>Content unavailable offline</h1><p>Connect to the internet once to finish saving the app for offline use, then reopen it.</p></main>';return}if(!localStorage.getItem(APPEARANCE_KEY)&&localStorage.getItem('whdc-dark')==='1')localStorage.setItem(APPEARANCE_KEY,'dark');if(!localStorage.getItem(READING_SIZE_KEY)&&localStorage.getItem('whdc-large')==='1')localStorage.setItem(READING_SIZE_KEY,'120');applyReadingPreferences();const visited=localStorage.getItem(VISITED_KEY)==='1';const hash=location.hash.slice(1);const saved=localStorage.getItem(START_PAGE_KEY);const valid=['bible','home','today','explore','topics','saved','history','plans','plan-detail','support','contact','about','settings'];const openMatch=/^devotional\/(.+)$/.exec(hash);let restoredId=null;if(openMatch){try{const id=decodeURIComponent(openMatch[1]);if(data.some(d=>d.id===id))restoredId=id}catch{}}view=restoredId?'today':valid.includes(hash)?hash:openingPage();currentId=restoredId||dailyPick(data)?.id;if(openMatch&&!restoredId)history.replaceState(null,'','#'+view);displayedPickDate=pickDate();render();checkNewAnnouncementOnArrival();if(visited)welcomeOpeningChoice();localStorage.setItem(VISITED_KEY,'1')}start().then(()=>loadCustomReadingPlans());

// Only mobile browsers use offline app caching.
const whdcDesktopBrowser=!/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)&&!(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
if(!whdcDesktopBrowser&&'serviceWorker' in navigator&&location.protocol==='https:'){
 window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(console.warn));
}

// Keep the displayed selection in sync even when the app stays open overnight.
setInterval(()=>{if(data.length)refreshDailyPick()},60000);

// Devotional selections use Save Quote only; Bible Reader study tools remain separate.

// Inductive paragraph notes (shared with Bible Reader).
if(!document.querySelector('script[src^="/bible/study-notes.js"]')){const script=document.createElement('script');script.src='/bible/study-notes.js?v=1';script.defer=true;document.body.append(script)}

// Contextual audio dock, loaded independently to keep the devotional renderer small.
if(!document.getElementById('whdc-audio-dock-loader')){const dockScript=document.createElement('script');dockScript.id='whdc-audio-dock-loader';dockScript.src='/audio/audio-dock.js?v=20261023';document.head.appendChild(dockScript)}

window.addEventListener('whdc-return-to-reading',()=>nav('read'));

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&whdcBookModalId){whdcBookModalId=null;render()}});
