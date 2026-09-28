import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {serializeSharedStrings} from '../scripts/shared-string-codec.mjs';
test('shared source strings round-trip without changing facts or executing their contents',()=>{
 const repeated='https://example.org/auditable-source/snapshot/document#original-record';
 const input={rows:Array.from({length:30},(_,i)=>({id:i,source:repeated,note:'保留原始字段',image:null,verified:false})),text:'"; throw new Error("unsafe"); //'};
 const code=serializeSharedStrings(input);
 const restored=JSON.parse(vm.runInNewContext(code+'JSON.stringify(data)'));
 assert.deepEqual(restored,input);
 assert.ok(Buffer.byteLength(code)<Buffer.byteLength(JSON.stringify(input)));
 assert.equal(serializeSharedStrings(input),code);
});
