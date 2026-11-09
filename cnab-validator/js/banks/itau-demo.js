import {isoTo6,nextDay} from '../cnab-parser.js';
import {setField} from '../demo.js';
/** Arquivo exclusivamente sintético para exercitar o módulo Itaú. */
export function makeItauDemo({broken=false,date='2030-01-15',ending='\r\n',fine=true}={}){
  const id='123400012346';let due=date;for(let i=0;i<10;i++)due=nextDay(due);
  let header=' '.repeat(400);for(const [s,e,v] of [[1,1,'0'],[2,9,'1REMESSA'],[10,11,'01'],[12,26,'COBRANCA'.padEnd(15)],[27,38,id],[47,76,'NOME DA EMPRESA'.padEnd(30)],[77,79,'341'],[80,94,'BANCO ITAU SA'.padEnd(15)],[95,100,isoTo6(date)],[395,400,'000001']])header=setField(header,s,e,v);
  const rows=[header];
  for(let i=1;i<=3;i++){
    let d=' '.repeat(400);for(const [s,e,v] of [[1,1,'1'],[2,3,'02'],[4,17,'12345678000100'],[18,29,id],[34,37,'0000'],[63,70,String(i).padStart(8,'0')],[71,83,'0'.repeat(13)],[84,86,'109'],[108,108,'I'],[109,110,'01'],[111,120,('TESTE'+i).padEnd(10)],[121,126,isoTo6(due)],[127,139,String(i*10000).padStart(13,'0')],[140,142,'341'],[143,147,'00000'],[148,149,'01'],[150,150,'N'],[151,156,isoTo6(date)],[157,158,i===1?'92':i===3?'16':'00'],[159,160,'00'],[161,173,i===1?'0000000000033':'0000000000000'],[174,179,'000000'],[180,192,'0'.repeat(13)],[193,205,'0'.repeat(13)],[206,218,'0'.repeat(13)],[219,220,'01'],[221,234,'00012345678901'],[235,274,('PAGADOR FICTICIO '+i).padEnd(40)],[275,314,'RUA DE EXEMPLO 123'.padEnd(40)],[315,326,'BAIRRO TESTE'.padEnd(12)],[327,334,'00000000'],[335,349,'CIDADE FICTICIA'.padEnd(15)],[350,351,'SP'],[386,391,'000000'],[392,393,i===1?'30':'00'],[395,400,String(rows.length+1).padStart(6,'0')]])d=setField(d,s,e,v);
    if(broken&&i===1){d=setField(d,157,158,'44');d=setField(d,161,173,'0000000000000');d=setField(d,121,126,'310230');}
    rows.push(d);
    if(i===1&&fine){let f=' '.repeat(400);for(const [s,e,v] of [[1,1,'2'],[2,2,'2'],[3,10,isoTo6(nextDay(due)).slice(0,4)+'20'+isoTo6(nextDay(due)).slice(4)],[11,23,'0000000000200'],[395,400,String(rows.length+1).padStart(6,'0')]])f=setField(f,s,e,v);rows.push(f);}
  }
  let trailer=' '.repeat(400);trailer=setField(trailer,1,1,'9');trailer=setField(trailer,395,400,String(rows.length+1).padStart(6,'0'));rows.push(trailer);return rows.join(ending)+ending;
}
