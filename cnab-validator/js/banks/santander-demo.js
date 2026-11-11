import {isoTo6,nextDay} from '../cnab-parser.js';
import {setField} from '../demo.js';
/** Dados inteiramente sintéticos; nenhuma parametrização de cliente é distribuída. */
export function makeSantanderDemo({broken=false,date='2030-01-15',ending='\r\n',charges=true}={}){
  const transmission='12340012345600123456';let due=date;for(let i=0;i<10;i++)due=nextDay(due);
  const fill=(entries)=>entries.reduce((row,[s,e,v])=>setField(row,s,e,v),' '.repeat(400));
  const rows=[fill([[1,1,'0'],[2,9,'1REMESSA'],[10,11,'01'],[12,26,'COBRANCA'.padEnd(15)],[27,46,transmission],[47,76,'EMPRESA FICTICIA'.padEnd(30)],[77,79,'033'],[80,94,'SANTANDER'.padEnd(15)],[95,100,isoTo6(date)],[101,116,'0'.repeat(16)],[392,394,'001'],[395,400,'000001']])];
  for(let i=1;i<=3;i++){
    let row=fill([[1,1,'1'],[2,3,'02'],[4,17,'12345678000195'],[18,37,transmission],[63,70,String(i).padStart(8,'0')],[71,76,'000000'],[78,78,charges&&i===1?'4':'0'],[79,82,charges&&i===1?'0200':'0000'],[83,97,'0'.repeat(15)],[102,107,'000000'],[108,108,'5'],[109,110,'01'],[111,120,('TESTE'+i).padEnd(10)],[121,126,isoTo6(due)],[127,139,String(i*10000).padStart(13,'0')],[140,142,'033'],[143,147,'01234'],[148,149,'01'],[150,150,'N'],[151,156,isoTo6(date)],[157,158,charges&&i===1?'02':'00'],[159,160,'00'],[161,173,charges&&i===1?'0000000000033':'0000000000000'],[174,179,'000000'],[180,218,'0'.repeat(39)],[219,220,'01'],[221,234,'00052998224725'],[235,274,('PAGADOR FICTICIO '+i).padEnd(40)],[275,314,'RUA DE EXEMPLO 123'.padEnd(40)],[315,326,'BAIRRO TESTE'.padEnd(12)],[327,334,'01001000'],[335,349,'SAO PAULO'.padEnd(15)],[350,351,'SP'],[383,383,'I'],[384,385,'78'],[392,393,'00'],[395,400,String(rows.length+1).padStart(6,'0')]]);
    if(broken&&i===1){row=setField(row,121,126,'310230');row=setField(row,78,78,'2');row=setField(row,157,158,'06');row=setField(row,392,393,'00');}rows.push(row);
  }
  rows.push(fill([[1,1,'9'],[2,7,'000005'],[8,20,broken?'0000000060001':'0000000060000'],[21,394,'0'.repeat(374)],[395,400,'000005']]));return rows.join(ending)+ending;
}
