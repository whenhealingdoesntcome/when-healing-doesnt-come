/** Native-only reader API. The caller MUST provide a Keychain/Keystore-backed vault.
 * vault.get(), vault.set(token), vault.clear() must never use localStorage or Preferences.
 */
export function createNativeReaderApi({vault, baseUrl='https://whdcdevotions.com'}) {
  if (!vault || !['get','set','clear'].every(k=>typeof vault[k]==='function')) throw Error('Secure native token vault required');
  if (new URL(baseUrl).protocol !== 'https:') throw Error('HTTPS required');
  async function call(path,{method='GET',body,authenticated=true}={}) {
    const token=authenticated?await vault.get():null;
    if(authenticated&&!token)throw Error('Sign in required');
    const headers={'accept':'application/json'};
    if(body!==undefined)headers['content-type']='application/json';
    if(token)headers.authorization=`Bearer ${token}`;
    const response=await fetch(`${baseUrl}/api/reader/native/${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
    const data=await response.json();
    if(!response.ok){if(response.status===401)await vault.clear();throw Error(data.error||`Request failed (${response.status})`)}
    return data;
  }
  return {
    requestCode:email=>call('request-code',{method:'POST',body:{email},authenticated:false}),
    async verifyCode(email,code){const result=await call('verify-code',{method:'POST',body:{email,code},authenticated:false});await vault.set(result.accessToken);return {ok:result.ok,email:result.email}},
    me:()=>call('me'),
    sync:()=>call('sync'),
    syncItem:(key,value,baseRevision)=>call('sync',{method:'POST',body:{key,value,baseRevision}}),
    savedData:()=>call('saved-data'),
    saveData:body=>call('saved-data',{method:'POST',body}),
    async logout(){try{await call('logout',{method:'POST'})}finally{await vault.clear()}},
    async deleteAccount(email){const result=await call('delete-account',{method:'POST',body:{email,confirm:'DELETE'}});await vault.clear();return result}
  };
}
