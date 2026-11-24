// Narrow, high-confidence guard: a direct hiring invitation plus application/role context.
// Mere mentions of AI, research, Adobe or careers never trigger it. Source text only, not user notes.
export function recruitmentIds(body){
 const texts=new Map();
 for(const b of body.blocks||[])if(b.kind==='source')texts.set(b.id,(texts.get(b.id)||'')+'\n'+b.text);
 for(const x of body.inventory||[])texts.set(x.id,(texts.get(x.id)||'')+'\n'+(x.excerpt||''));
 const invitation=/招(?:聘)?(?:暑期|夏季|科研|研究)?实习生|我们[^。\n]{0,20}(?:招聘|在招)|we(?:['’]re| are) (?:hiring|recruiting|looking for)|join our team|invites? applications/i;
 const application=/欢迎申请|申请链接|投递|简历|岗位|职位|apply|application|internship|open roles|resume|CV\b/i;
 return new Set([...texts].filter(([,text])=>invitation.test(text)&&application.test(text)).map(([id])=>id));
}
