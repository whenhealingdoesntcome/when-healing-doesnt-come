import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePublicApiUrl,installNativePublicApiBridge} from '../src/native-api-bridge.mjs';
test('public APIs use HTTPS backend',()=>assert.equal(resolvePublicApiUrl('/api/scripture?reference=John%203%3A16'),'https://whdcdevotions.com/api/scripture?reference=John%203%3A16'));
test('private, write and non-api paths are not bridged',()=>{for(const p of ['/api/reader/sync','/api/push/subscribe','/images/icons/favicon.png','/api/contact'])assert.equal(resolvePublicApiUrl(p),null)});
test('rejects insecure backend',()=>assert.throws(()=>resolvePublicApiUrl('/api/devotionals','http://example.com')));
test('public GET removes credentials; private POST remains local',async()=>{const calls=[];const target={fetch:async (...args)=>{calls.push(args);return {ok:true}}};const restore=installNativePublicApiBridge({target});await target.fetch('/api/devotionals',{credentials:'include'});await target.fetch('/api/reader/sync',{method:'POST'});assert.equal(calls[0][0],'https://whdcdevotions.com/api/devotionals');assert.equal(calls[0][1].credentials,'omit');assert.equal(calls[1][0],'/api/reader/sync');restore()});
