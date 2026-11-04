import {isoTo6,nextDay} from './cnab-parser.js';
export function setField(text,start,end,value) {
  if(String(value).length!==end-start+1)throw new Error('Tamanho inválido na fixture: '+start+'–'+end);
  return text.slice(0,start-1)+value+text.slice(end);
}
export function makeDemo({broken=false,date='2030-01-15',ending='\r\n',complement=null}={}) {
  const company='12345001234567';
  let h=' '.repeat(400);for(const [s,e,v] of [[1,1,'0'],[2,2,'1'],[3,9,'REMESSA'],[10,11,'01'],[12,19,'COBRANCA'],[27,40,company],[47,76,'NOME DA EMPRESA'.padEnd(30)],[77,79,'422'],[80,90,'SAFRA'.padEnd(11)],[95,100,isoTo6(date)],[392,394,'001'],[395,400,'000001']]) h=setField(h,s,e,v);
  const rows=[h];let due=date;for(let i=0;i<10;i++)due=nextDay(due);
  for(let i=1;i<=3;i++) {
    let d=' '.repeat(400);
    for(const [s,e,v] of [[1,1,'1'],[2,3,'02'],[4,17,'00000000000000'],[18,31,company],[63,71,String(i).padStart(9,'0')],[86,91,isoTo6(nextDay(due))],[102,102,'0'],[103,104,'00'],[106,107,'00'],[108,108,'1'],[109,110,'01'],[111,120,('TESTE'+i).padEnd(10)],[121,126,isoTo6(due)],[127,139,String(i*10000).padStart(13,'0')],[140,142,'422'],[143,147,'12345'],[148,149,'01'],[150,150,'N'],[151,156,isoTo6(date)],[157,158,broken&&i===1?'00':'05'],[159,160,'16'],[161,173,'0000000000033'],[174,179,'000000'],[180,192,'0'.repeat(13)],[193,205,'0'.repeat(13)],[206,211,isoTo6(nextDay(due))],[212,215,'0200'],[216,218,'000'],[219,220,'01'],[221,234,'00000000000000'],[235,274,('PAGADOR SINTETICO '+i).padEnd(40)],[327,334,'00000000'],[382,384,'030'],[388,388,'0'],[389,391,'422'],[392,394,'001'],[395,400,String(rows.length+1).padStart(6,'0')]]) d=setField(d,s,e,v);
    rows.push(d);
    if(complement && i===1) {let c=' '.repeat(400);c=setField(c,1,1,complement);c=setField(c,395,400,String(rows.length+1).padStart(6,'0'));rows.push(c);}
  }
  let t=' '.repeat(400);for(const [s,e,v] of [[1,1,'9'],[369,376,'00000003'],[377,391,String(broken?59999:60000).padStart(15,'0')],[392,394,'001'],[395,400,String(rows.length+1).padStart(6,'0')]])t=setField(t,s,e,v);
  rows.push(t);return rows.join(ending)+ending;
}
