import {parseCNAB,localToday,validISO} from './cnab-parser.js';
import {loadBank} from './bank-registry.js';
export async function validateFile(input,options={}) {
  const {bank,module}=await loadBank(options.bank??'422',options.layout??'400');
  const referenceDate=options.referenceDate??localToday();
  if(!validISO(referenceDate)|| (options.sendDate && !validISO(options.sendDate))) throw new Error('Selecione datas de conferência e envio válidas.');
  const identificationLength=module.identificationLength??14;
  if(options.expectedIdentification && !(new RegExp('^\\d{'+identificationLength+'}$')).test(options.expectedIdentification)) throw new Error('A identificação esperada deve conter '+identificationLength+' dígitos.');
  const parsed=parseCNAB(input),checks=[];
  const context={...options,referenceDate,bank,parsed,add(item) {
    checks.push({id:checks.length+1,line:null,recordType:'Arquivo',start:null,end:null,found:'',expected:'',reference:module.reference??(bank.name+' CNAB '+(options.layout??'400')),...item});
  }};
  const analysis=module.validate(context);
  const summary={checks:checks.length,errors:checks.filter(x=>x.level==='error').length,warnings:checks.filter(x=>x.level==='warning').length,passed:checks.filter(x=>x.level==='info').length};
  return {version:1,analyzedAt:new Date().toISOString(),bank:{code:bank.code,name:bank.name},layout:options.layout??'400',fileName:options.fileName??'arquivo.rem',byteLength:parsed.byteLength,encoding:parsed.encoding,endings:parsed.endings,referenceDate,sendDate:options.sendDate||null,today:localToday(),ruleset:module.ruleset??('CNAB '+(options.layout??'400')),expectedIdentification:options.expectedIdentification||null,expectedWallet:options.expectedWallet||null,...analysis,summary,checks,records:parsed.records};
}
