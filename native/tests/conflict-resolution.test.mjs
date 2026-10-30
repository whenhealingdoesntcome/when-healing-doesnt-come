import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveNativeSyncConflict} from '../src/native-safe-sync.mjs';
const conflict={key:'journal',localValue:'device',cloudValue:'server',cloudRevision:2};
function fixture(){const map=new Map([['journal','device']]);const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};let rev=2;let value='server';const controller={sync:async()=>({items:{journal:{value,revision:rev}}}),syncItem:async(k,v,r)=>{if(r!==rev)throw Error('revision conflict');value=v;rev++;return {revision:rev}}};return {map,storage,controller};}
test('keep local requires explicit choice and CAS',async()=>{const f=fixture();await resolveNativeSyncConflict({...f,conflict,choice:'local'});assert.equal((await f.controller.sync()).items.journal.value,'device')});
test('keep cloud backs up device data',async()=>{const f=fixture();const r=await resolveNativeSyncConflict({...f,conflict,choice:'cloud'});assert.equal(f.storage.getItem('journal'),'server');assert.equal(f.storage.getItem(r.backupKey),'device')});
test('reject stale cloud version',async()=>{const f=fixture();await f.controller.syncItem('journal','changed',2);await assert.rejects(resolveNativeSyncConflict({...f,conflict,choice:'cloud'}),/Cloud data changed/);assert.equal(f.storage.getItem('journal'),'device')});
test('reject changed local version',async()=>{const f=fixture();f.storage.setItem('journal','new');await assert.rejects(resolveNativeSyncConflict({...f,conflict,choice:'local'}),/Local data changed/)});
test('reject implicit choice',async()=>{const f=fixture();await assert.rejects(resolveNativeSyncConflict({...f,conflict}),/Explicit conflict choice/)});
