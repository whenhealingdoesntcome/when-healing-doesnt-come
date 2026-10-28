const $=id=>document.getElementById(id),message=$('message');
async function api(path,body){const r=await fetch('/api/reader/'+path,{method:body?'POST':'GET',credentials:'same-origin',headers:body?{'content-type':'application/json'}:{},body:body?JSON.stringify(body):undefined,cache:'no-store'});const j=await r.json();if(!r.ok)throw Error(j.error||'Request failed');return j}
function show(which){for(const id of ['account','request','verify'])$(id).hidden=id!==which}
(async()=>{if(location.hostname!=='whdcdevotions.com'){message.textContent='Reader accounts are only available at whdcdevotions.com.';return}try{const result=await api('me');if(result.signedIn){$('who').textContent=result.email;show('account')}else show('request')}catch(e){message.textContent=e.message}})();
$('request').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;message.textContent='Sending code…';try{const r=await api('request-code',{email:$('email').value});message.textContent=r.message;show('verify')}catch(e){message.textContent=e.message}finally{b.disabled=false}};
$('verify').onsubmit=async e=>{e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;message.textContent='Checking code…';try{const r=await api('verify-code',{email:$('email').value,code:$('code').value});$('who').textContent=r.email;show('account');message.textContent='Signed in. Saved data is still stored locally until syncing is enabled.'}catch(e){message.textContent=e.message}finally{b.disabled=false}};
$('restart').onclick=()=>{show('request');message.textContent=''};
$('logout').onclick=async()=>{try{await api('logout',{});show('request');message.textContent='Signed out.'}catch(e){message.textContent=e.message}};

const deleteDialog=$('deleteDialog');
$('deleteAccount').onclick=()=>{$('deleteError').textContent='';deleteDialog.showModal()};
$('cancelDelete').onclick=()=>deleteDialog.close();
$('confirmDelete').onclick=async()=>{
  const button=$('confirmDelete');
  button.disabled=true;
  $('cancelDelete').disabled=true;
  $('deleteError').textContent='';
  button.textContent='Deleting…';
  try{
    await api('delete-account',{email:$('who').textContent,confirm:'DELETE'});
    deleteDialog.close();
    show('request');
    $('code').value='';
    message.textContent='Your account and cloud-saved data were deleted. Data stored only on your devices remains until cleared separately.';
  }catch(e){
    $('deleteError').textContent=e.message;
  }finally{
    button.disabled=false;
    $('cancelDelete').disabled=false;
    button.textContent='Yes, Delete Account';
  }
};
