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
    {id:'topics',label:'Topics',href:'/#topics'},
    {id:'explore',label:'Explore',href:'/#explore'},
    {id:'support',label:'Donate',href:'/#support'},
    {id:'bible',label:'Bible',href:'/bible-reader.html'},
    {id:'settings',label:'Settings',href:'/#settings'}
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
    element.innerHTML=desktopItems.map(item=>make(item,'whdc-desktop-menu-only')).join('')+
      items.map(item=>make(item,'whdc-mobile-menu-only')).join('');
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
    {id:'topics',label:'Topics',href:'/#topics',icon:'search'},
    {id:'plans',label:'Reading Plans',href:'/#plans',icon:'book'},
    {id:'journal',label:'My Journal',href:'/#journal',icon:'book'},
    {id:'saved',label:'Saved Devotionals',href:'/#saved',icon:'book'},
    {id:'history',label:'Reading Log',href:'/#history',icon:'book'},
    {id:'study-guide',label:'Bible Study',href:'/#study-guide',icon:'book'},
    {id:'support',label:'Donate',href:'/#support',icon:'home'},
    {id:'contact',label:'Contact',href:'/#contact',icon:'home'}
  ];
  function selectedTabs(){
    try{
      const parsed=JSON.parse(localStorage.getItem(NAV_KEY)||'null');
      if(Array.isArray(parsed)&&parsed.length<=4&&parsed.length>=1&&new Set(parsed).size===parsed.length&&parsed.every(id=>customTabs.some(t=>t.id===id)))return parsed;
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
    search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l-1.86 1.86A1.7 1.7 0 0 0 16 18.4a1.7 1.7 0 0 0-1.7 1.6h-2.6A1.7 1.7 0 0 0 10 18.4a1.7 1.7 0 0 0-1.88.34l-1.86-1.86A1.7 1.7 0 0 0 6.6 15 1.7 1.7 0 0 0 5 13.3v-2.6A1.7 1.7 0 0 0 6.6 9a1.7 1.7 0 0 0-.34-1.88l1.86-1.86A1.7 1.7 0 0 0 10 5.6 1.7 1.7 0 0 0 11.7 4h2.6A1.7 1.7 0 0 0 16 5.6a1.7 1.7 0 0 0 1.88-.34l1.86 1.86A1.7 1.7 0 0 0 19.4 9 1.7 1.7 0 0 0 21 10.7v2.6a1.7 1.7 0 0 0-1.6 1.7z"/>'
  };
  function bottomNav(current,inApp){
    if(!document.getElementById('whdc-bottom-nav-css')){
      const css=document.createElement('style');css.id='whdc-bottom-nav-css';css.textContent=`
      .whdc-bottom-nav{display:none}
      @media(max-width:767px){
        body{padding-bottom:calc(88px + env(safe-area-inset-bottom,0px))!important}
        .whdc-bottom-nav{display:grid;grid-template-columns:repeat(var(--whdc-tab-count,5),minmax(0,1fr));position:fixed;bottom:0;left:0;right:0;z-index:1100;min-height:76px;padding:5px 4px calc(17px + env(safe-area-inset-bottom,0px));background:var(--card,#fff);color:var(--ink,#293d3a);border-top:1px solid #bac9c3;box-shadow:0 -3px 14px rgba(20,30,28,.1)}
        .whdc-bottom-nav a,.whdc-bottom-nav button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:52px;min-width:0;padding:4px 0;border:0;border-radius:9px;background:transparent;color:inherit;text-decoration:none;font:inherit;font-size:11px;line-height:1.2;cursor:pointer}
        .whdc-bottom-nav svg{height:23px;width:23px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
        .whdc-bottom-nav [aria-current="page"]{background:rgba(115,151,137,.18);font-weight:700;color:var(--ink,#293d3a)}
        .whdc-bottom-nav a:focus-visible,.whdc-bottom-nav button:focus-visible{outline:3px solid #477f76;outline-offset:-3px}
      }`;
      document.head.appendChild(css);
    }
    let bar=document.getElementById('whdc-bottom-nav');
    if(!bar){bar=document.createElement('nav');bar.id='whdc-bottom-nav';bar.className='whdc-bottom-nav';bar.setAttribute('aria-label','Quick navigation');document.body.appendChild(bar)}
    const chosen=selectedTabs().map(id=>customTabs.find(item=>item.id===id)).filter(Boolean).concat(bottomItems[4]);
    bar.style.setProperty('--whdc-tab-count',String(chosen.length));
    bar.innerHTML=chosen.map(item=>{
      const active=item.id===current?' aria-current="page"':'';
      const inner=`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[item.icon]}</svg><span>${item.label}</span>`;
      return inApp&&item.id!=='bible'?`<button type="button" data-nav="${item.id}"${active}>${inner}</button>`:`<a href="${item.href}"${active}>${inner}</a>`;
    }).join('');
    if(inApp)bar.querySelectorAll('button[data-nav]').forEach(button=>button.addEventListener('click',()=>{
      const menuButton=document.querySelector('#mainMenu [data-nav="'+button.dataset.nav+'"]');
      if(menuButton)menuButton.click();
      else location.assign('/#'+button.dataset.nav);
    }));
  }
  window.WHDCNav={items,render,setup,bottomNav,customTabs,selectedTabs,setTabs};
  document.addEventListener('DOMContentLoaded',()=>{
    if(document.getElementById('bibleSiteNav'))bottomNav('bible',false);
    else if(document.getElementById('getAppSiteNav'))bottomNav(null,false);
  });
})();
