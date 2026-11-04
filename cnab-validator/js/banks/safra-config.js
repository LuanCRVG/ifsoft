/** Fixed registration model used in this ERP's homologated Safra CNAB 400 integration. */
export function composeIdentification(config={}) {
  const issues=[];
  const agency=typeof config.agency==='string'?config.agency:'';
  const agencyDv=typeof config.agencyDv==='string'?config.agencyDv:'';
  const account=typeof config.account==='string'?config.account:'';
  const accountDv=typeof config.accountDv==='string'?config.accountDv:'';
  for(const [value,size,label] of [[agency,5,'Agência'],[agencyDv,1,'Dígito da agência'],[account,8,'Conta corrente'],[accountDv,1,'Dígito da conta']]) {
    if(!new RegExp('^\\d{'+size+'}$').test(value)) issues.push(label+': informe exatamente '+size+' dígito'+(size===1?'':'s')+', preservando os zeros à esquerda.');
  }
  const identification=agency+account+accountDv;
  return {valid:issues.length===0,agency,agencyDv,account,accountDv,accountWithDv:account+accountDv,identification,beneficiary:issues.length===0?identification:'',issues,notes:['O dígito da agência é informado no ERP, mas não integra o código do cedente.']};
}
