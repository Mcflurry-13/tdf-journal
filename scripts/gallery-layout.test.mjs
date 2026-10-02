import assert from 'node:assert/strict';
import { justifiedRows } from '../src/gallery-layout.mjs';
function verify(items,width,mobile=false,pair=false) {
 const rows=justifiedRows(items,width,mobile,pair); let cursor=0;
 for(const row of rows) {
  assert.equal(row.start,cursor); assert(row.count>=1 && row.count<=(mobile||pair?2:3));
  const slice=items.slice(cursor,cursor+row.count);
  if(slice.some(x=>x.wide))assert.equal(row.count,1);
  const span=row.height*slice.reduce((s,x)=>s+x.ratio,0)+(row.count-1)*(mobile?8:12);
  if(row.count>1) assert(Math.abs(span-width)<.001);
  else assert(span<=width+.001 && row.height<=480);
  cursor+=row.count;
 }
 assert.equal(cursor,items.length);return rows;
}
assert.deepEqual(justifiedRows([],900),[]);
assert.equal(verify([{ratio:.5}],900)[0].height,480);
assert.equal(verify([{ratio:2}],900)[0].height,450);
assert.deepEqual(verify(Array.from({length:5},()=>({ratio:1.5})),888).map(r=>r.count).sort(),[2,3]);
assert.equal(verify([{ratio:.6},{ratio:2}],358,true,true).length,1);
verify([{ratio:1},{ratio:2,wide:true},{ratio:1},{ratio:1}],888);
// Deterministic stress cases: order, column limits, no clipping and exact filled width.
let seed=31;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
for(let n=1;n<=40;n++)for(const width of [358,620,888,1200]){
 const items=Array.from({length:n},()=>({ratio:.15+rand()*5,wide:rand()<.08}));
 const a=verify(items,width,width<640);assert.deepEqual(a,justifiedRows(items,width,width<640));
}
console.log('Justified layout: 160 mixed-aspect scenarios and edge cases passed.');
