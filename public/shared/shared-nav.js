/* Shared public navigation. Backend dashboards deliberately do not load this file. */
(function(){
  'use strict';
  const items=[
    {id:'home',label:'Home',href:'/#home'},
    {id:'today',label:'Today',href:'/#today'},
    {id:'topics',label:'Topics',href:'/#topics'},
    {id:'saved',label:'Saved',href:'/#saved'},
    {id:'history',label:'History',href:'/#history'},
    {id:'support',label:'Donate',href:'/#support'},
    {id:'contact',label:'Contact',href:'/#contact'},
    {id:'bible',label:'Bible',href:'/bible-reader.html'},
    {id:'settings',label:'Settings',href:'/#settings'}
  ];
  // Desktop dropdown has a shorter menu; mobile dropdown retains its original links.
  const desktopItems=[
    {id:'home',label:'Home',href:'/#home'},
    {id:'today',label:'Today',href:'/#today'},
    {id:'bible',label:'Bible',href:'/bible-reader.html'},
    {id:'explore',label:'Explore',href:'/#explore'},
    {id:'support',label:'Donate',href:'/#support'},
    {id:'contact',label:'Contact',href:'/#contact'},
    {id:'settings',label:'Settings',href:'/#settings'}
  ];
  const exploreItems=[
    {id:'topics',label:'Browse by Topic'},
    {id:'resources',label:'Resources'},
    {id:'plans',label:'Reading Plans'},
    {id:'journal',label:'My Journal'},
    {id:'study-guide',label:'Bible Study'},
    {id:'saved',label:'Saved Devotionals'},
    {id:'history',label:'Reading Log'}
  ];
  function render(element, current, inApp){
    if(!element)return;
    if(!document.getElementById('whdc-desktop-menu-split')){
      const style=document.createElement('style');
      style.id='whdc-desktop-menu-split';
      style.textContent='@media(min-width:768px){.whdc-nav .whdc-mobile-menu-only{display:none!important}}@media(max-width:767px){.whdc-nav .whdc-desktop-menu-only{display:none!important}}';
      document.head.appendChild(style);
    }
    const make=(item,extra)=>{
      const active=item.id===current?' aria-current="page"':'';
      if(inApp && item.id!=='bible')return `<button type="button" class="navbtn ${extra}" data-nav="${item.id}"${active}>${item.label.toUpperCase()}</button>`;
      return `<a class="navbtn ${extra}" data-nav="${item.id}" href="${item.href}"${active}>${item.label.toUpperCase()}</a>`;
    };
    element.innerHTML=desktopItems.map(item=>item.id==='explore'?`<div class="whdc-desktop-menu-only whdc-explore-dropdown"><button type="button" class="navbtn whdc-explore-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="whdcExploreDropdown">EXPLORE <span aria-hidden="true">▾</span></button><div id="whdcExploreDropdown" class="whdc-explore-dropdown-list" hidden>${exploreItems.map(entry=>make(entry,'whdc-explore-link')).join('')}</div></div>`:make(item,'whdc-desktop-menu-only')).join('')+
      items.map(item=>make(item,'whdc-mobile-menu-only')).join('');
    window.__whdcNavMenuAbort?.abort();window.__whdcNavMenuAbort=new AbortController();
    const trigger=element.querySelector('.whdc-explore-trigger');
    const dropdown=element.querySelector('#whdcExploreDropdown');
    if(trigger&&dropdown){
      const close=()=>{dropdown.hidden=true;trigger.setAttribute('aria-expanded','false')};
      const openMenu=()=>{dropdown.hidden=false;trigger.setAttribute('aria-expanded','true')};
      trigger.addEventListener('click',()=>{const open=dropdown.hidden;dropdown.hidden=!open;trigger.setAttribute('aria-expanded',String(open))});
      const wrapper=trigger.closest('.whdc-explore-dropdown');
      // Hover opens on desktop; keyboard focus and click remain available.
      wrapper.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')openMenu()});
      wrapper.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')close()});
      wrapper.addEventListener('focusout',e=>{if(!wrapper.contains(e.relatedTarget))close()});
      trigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();openMenu();dropdown.querySelector('[data-nav]')?.focus()}});
      dropdown.addEventListener('click',e=>{if(e.target.closest('[data-nav]'))close()});
      document.addEventListener('pointerdown',e=>{if(!trigger.closest('.whdc-explore-dropdown')?.contains(e.target))close()},{signal:window.__whdcNavMenuAbort?.signal});
      trigger.addEventListener('keydown',e=>{if(e.key==='Escape'){close();trigger.focus()}});
    }

  }
  function setup(menuId,toggleId,current){
    const menu=document.getElementById(menuId),toggle=document.getElementById(toggleId);
    render(menu,current,false);
    if(!menu||!toggle)return;
    menu.setAttribute('aria-label','Main navigation');
    const close=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation menu')};
    toggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu')});
    document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!toggle.contains(e.target))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){close();toggle.focus()}});
  }
  // One mobile tab bar shared by all public-facing pages. Never load on admin pages.
  const bottomItems=[
    {id:'home',label:'Home',href:'/#home',icon:'home'},
    {id:'today',label:'Today',href:'/#today',icon:'sun'},
    {id:'bible',label:'Bible',href:'/bible-reader.html',icon:'book'},
    {id:'explore',label:'Explore',href:'/#explore',icon:'search'},
    {id:'settings',label:'Settings',href:'/#settings',icon:'settings'}
  ];
  const NAV_KEY='whdc-bottom-nav-pages-v1';
  const defaultTabs=['home','today','bible','explore'];
  const customTabs=[
    {id:'home',label:'Home',href:'/#home',icon:'home'},
    {id:'today',label:'Today',href:'/#today',icon:'sun'},
    {id:'bible',label:'Bible',href:'/bible-reader.html',icon:'book'},
    {id:'explore',label:'Explore',href:'/#explore',icon:'search'},
    {id:'topics',label:'Topics',href:'/#topics',icon:'list'},
    {id:'plans',label:'Reading Plans',href:'/#plans',icon:'calendar'},
    {id:'journal',label:'My Journal',href:'/#journal',icon:'pen'},
    {id:'saved',label:'Saved Devotionals',href:'/#saved',icon:'bookmark'},
    {id:'history',label:'Reading Log',href:'/#history',icon:'clock'},
    {id:'study-guide',label:'Bible Study',href:'/#study-guide',icon:'flask'},
  ];
  function selectedTabs(){
    try{
      const parsed=JSON.parse(localStorage.getItem(NAV_KEY)||'null');
      if(Array.isArray(parsed)){const valid=[...new Set(parsed.filter(id=>customTabs.some(t=>t.id===id)))].slice(0,4);if(valid.length)return valid;}
    }catch(e){}
    return defaultTabs;
  }
  function setTabs(ids){
    if(!Array.isArray(ids)||ids.length<1||ids.length>4||new Set(ids).size!==ids.length||!ids.every(id=>customTabs.some(t=>t.id===id)))return false;
    localStorage.setItem(NAV_KEY,JSON.stringify(ids));
    const current=document.querySelector('#whdc-bottom-nav [aria-current="page"]')?.getAttribute('data-nav')||null;
    bottomNav(current,!!document.getElementById('app'));
    return true;
  }
  const icons={
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    book:'<path d="M12 7c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V6c-3-1-6-1-9 1zm0 0v14"/>',
    read:'<path d="M8 4h9a2 2 0 0 1 2 2v14H8a3 3 0 0 1 0-6h11M8 4a3 3 0 0 0-3 3v10a3 3 0 0 1 3-3"/><path d="m10 9 2 2 3-3"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/><path d="m9 16 2 2 4-4"/>',
    pen:'<path d="M12 20h9"/><path d="M16 4a2 2 0 0 1 3 3L9 17l-4 1 1-4Z"/>',
    bookmark:'<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 3"/>',
    flask:'<path d="M9 3h6m-5 0v7l-6 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-9V3M7 16h10"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l-1.86 1.86A1.7 1.7 0 0 0 16 18.4a1.7 1.7 0 0 0-1.7 1.6h-2.6A1.7 1.7 0 0 0 10 18.4a1.7 1.7 0 0 0-1.88.34l-1.86-1.86A1.7 1.7 0 0 0 6.6 15 1.7 1.7 0 0 0 5 13.3v-2.6A1.7 1.7 0 0 0 6.6 9a1.7 1.7 0 0 0-.34-1.88l1.86-1.86A1.7 1.7 0 0 0 10 5.6 1.7 1.7 0 0 0 11.7 4h2.6A1.7 1.7 0 0 0 16 5.6a1.7 1.7 0 0 0 1.88-.34l1.86 1.86A1.7 1.7 0 0 0 19.4 9 1.7 1.7 0 0 0 21 10.7v2.6a1.7 1.7 0 0 0-1.6 1.7z"/>'
  };
  function bottomNav(current,inApp){
    if(!document.getElementById('whdc-bottom-nav-css')){
      const css=document.createElement('style');css.id='whdc-bottom-nav-css';css.textContent=`
      .whdc-bottom-nav{display:none}
      @media(max-width:767px){
        body{padding-bottom:calc(88px + env(safe-area-inset-bottom,0px))!important}
        .whdc-bottom-nav{display:grid!important;gap:0!important;flex-wrap:nowrap!important;grid-template-columns:repeat(var(--whdc-tab-count,5),minmax(0,1fr));position:fixed;bottom:0;left:0;right:0;z-index:1100;min-height:76px;padding:5px 4px calc(17px + env(safe-area-inset-bottom,0px));background:#fffefa;color:#393f4a;border-top:1px solid #deded8;box-shadow:0 -3px 14px rgba(20,30,28,.1)}
        .whdc-bottom-nav a,.whdc-bottom-nav button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:52px;min-width:0;padding:4px 0;border:0;border-radius:9px;background:transparent;color:inherit!important;text-decoration:none;font:inherit;font-size:11px;line-height:1.2;cursor:pointer}
        .whdc-bottom-nav svg{height:23px;width:23px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
        .whdc-bottom-nav [aria-current="page"]{background:rgba(115,151,137,.18);font-weight:700;color:inherit!important}
        /* Identical palette across the app and the standalone Bible Reader. */
        body.dark .whdc-bottom-nav{background:#2a3335!important;color:#f0eee8!important;border-top-color:#4d5959!important}
        body.dark .whdc-bottom-nav a,body.dark .whdc-bottom-nav button{color:#f0eee8!important}
        body.dark .whdc-bottom-nav [aria-current="page"]{background:#50665e!important;color:#fff!important}
        body.dark .whdc-bottom-nav [aria-current="page"] svg{stroke:#fff!important}
        /* Use the same selected Bible tab in both the app and the Bible Reader. */
        body.dark .whdc-bottom-nav [data-nav="bible"] svg{stroke:#fff!important;fill:none!important}
        .whdc-bottom-nav a:focus-visible,.whdc-bottom-nav button:focus-visible{outline:3px solid #477f76;outline-offset:-3px}
      }`;
      document.head.appendChild(css);
    }
    let bar=document.getElementById('whdc-bottom-nav');
    if(!bar){bar=document.createElement('nav');bar.id='whdc-bottom-nav';bar.className='whdc-bottom-nav';bar.setAttribute('aria-label','Quick navigation');document.body.appendChild(bar)}
    const topicId=(()=>{try{return sessionStorage.getItem('whdc-topic-reading-session-v1')||''}catch{return ''}})();
    // A Topics reading session always gets the fourth tab, even when a reader
    // previously customized their shortcuts. Do not append a sixth mobile tab.
    const tabs=topicId?['home','today','bible','explore']:selectedTabs();
    const chosen=tabs.map(id=>customTabs.find(item=>item.id===id)).filter(Boolean).map(item=>item.id==='explore'&&topicId?{...item,id:'read',label:'Read',href:'/#read',icon:'read'}:item).concat(bottomItems[4]);
    bar.style.setProperty('--whdc-tab-count',String(chosen.length));
    bar.innerHTML=chosen.map(item=>{
      const active=(item.id==='read'?current==='read':item.id===current)?' aria-current="page"':'';
      const inner=`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[item.icon]}</svg><span>${item.label}</span>`;
      return inApp&&item.id!=='bible'?`<button type="button" data-nav="${item.id}"${active}>${inner}</button>`:`<a href="${item.href}" data-nav="${item.id}"${active}>${inner}</a>`;
    }).join('');
    if(inApp)bar.querySelectorAll('button[data-nav]').forEach(button=>button.addEventListener('click',()=>{
      if(button.dataset.nav==='read'&&typeof window.WHDCNavigate==='function'){window.WHDCNavigate('read');return}
      const menuButton=document.querySelector('#mainMenu [data-nav="'+button.dataset.nav+'"]');
      if(menuButton)menuButton.click();
      else location.assign('/#'+button.dataset.nav);
    }));
  }
  // Offline status is shared by the devotional app and the Bible Reader.
  // Display only when the browser reports that the connection is unavailable.
  function setupOfflineIndicator(){
    if(document.getElementById('whdc-offline-indicator'))return;
    const style=document.createElement('style');
    style.id='whdc-offline-indicator-style';
    style.textContent=`
      #whdc-offline-indicator{position:fixed;top:calc(env(safe-area-inset-top, 0px) + 9px);left:12px;z-index:2600;display:inline-flex;align-items:center;gap:7px;padding:7px 11px;border:1px solid #b5c1bd;border-radius:999px;background:#fff;color:#263a35;font:600 12px/1.3 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 2px 10px #0002;pointer-events:none;max-width:calc(100vw - 88px)}
      #whdc-offline-indicator::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#a06a35;flex:none}
      #whdc-offline-indicator[hidden]{display:none!important}
      /* Reserve a separate row for the offline badge above mobile Bible controls. */
      @media(max-width:767px){
        body.whdc-offline-active .site-header:has(.mobile-bible-toolbar){top:calc(env(safe-area-inset-top, 0px) + 43px)!important}
        body.whdc-offline-active .mobile-bible-toolbar{top:calc(env(safe-area-inset-top, 0px) + 43px)!important}
      }
      @media(min-width:768px){#whdc-offline-indicator{top:16px;left:16px}}
    `;
    document.head.appendChild(style);
    const badge=document.createElement('div');
    badge.id='whdc-offline-indicator';
    badge.setAttribute('role','status');
    badge.setAttribute('aria-live','polite');
    badge.textContent='Offline · Saved content only';
    badge.hidden=true;
    document.body.appendChild(badge);
    const update=()=>{const offline=navigator.onLine===false;badge.hidden=!offline;document.body.classList.toggle('whdc-offline-active',offline)};
    window.addEventListener('online',update);
    window.addEventListener('offline',update);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)update()});
    update();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupOfflineIndicator,{once:true});
  else setupOfflineIndicator();
  window.WHDCNav={items,render,setup,bottomNav,customTabs,selectedTabs,setTabs};
  document.addEventListener('DOMContentLoaded',()=>{
    if(document.getElementById('bibleSiteNav'))bottomNav('bible',false);
    else if(document.getElementById('getAppSiteNav'))bottomNav(null,false);
  });
})();
