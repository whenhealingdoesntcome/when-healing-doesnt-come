import { mountNativeSettingsAccount } from './native-settings-account.mjs';
/** Native-only bootstrap. Import this from the native entrypoint, not the PWA. */
export async function startNativeSettingsAccount({baseUrl='https://whdcdevotions.com', savedKeys=[]}={}) {
 const {Capacitor}=await import('@capacitor/core');
 if(!Capacitor.isNativePlatform()) return ()=>{};
 let mounted=null, pending=false, generation=0;
 async function refresh(){
   const root=document.getElementById('whdcNativeSettingsMount');
   if(!root||root.dataset.whdcMounted||pending)return;
   pending=true;const current=++generation;
   try{
     const result=await mountNativeSettingsAccount(root,{baseUrl,savedKeys});
     if(!root.isConnected||current!==generation){result.unmount();return;}
     root.dataset.whdcMounted='1';mounted=result;
   }catch(error){
     if(root.isConnected){root.replaceChildren();const message=document.createElement('p');message.setAttribute('role','alert');message.textContent='Account unavailable. Please try again later.';root.append(message);console.error('Native account mount failed',error);}
   }finally{pending=false;}
 }
 window.addEventListener('whdc:native-settings-rendered',refresh);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else void refresh();
 return ()=>{generation++;window.removeEventListener('whdc:native-settings-rendered',refresh);mounted?.unmount();};
}
