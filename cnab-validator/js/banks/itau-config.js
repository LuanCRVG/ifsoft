/** Cadastro Itaú: orientações do Sistema e comparação com a referência pública consultada. */
export const source=Object.freeze({url:'https://download.itau.com.br/bankline/layout_cobranca_400bytes_cnab_itau.pdf',edition:'Janeiro/2017',reviewedOn:'09/11/2026',reviewedISO:'2026-11-09',latestEditionConfirmed:false});
export const bankRegistration=Object.freeze({code:'341',name:'BANCO ITAÚ',wallet:'109',remittanceLayout:'C400',paymentLocation:'ATÉ O VENCIMENTO, PREFERENCIALMENTE NO ITAÚ. APÓS O VENC.SOMENTE NO ITAÚ.'});
export const defaults=Object.freeze({agencyDv:''});
export const accountExample=Object.freeze({agency:'1234',agencyDv:'',account:'01234',accountDv:'6'});
export function composeAccount(config={}){
  const value=name=>typeof config[name]==='string'?config[name]:'';
  const agency=value('agency'),agencyDv=value('agencyDv'),account=value('account'),accountDv=value('accountDv');
  const issues=[];
  if(!/^\d{4}$/.test(agency))issues.push('Agência: informe exatamente 4 dígitos, preservando os zeros à esquerda.');
  if(agencyDv!=='')issues.push('Dígito da agência: deixe vazio neste cadastro Itaú. O DAC da conta é informado em campo separado.');
  if(!/^\d{5}$/.test(account))issues.push('Conta corrente: informe exatamente 5 dígitos, sem o DAC.');
  if(!/^\d$/.test(accountDv))issues.push('DV da conta (DAC agência/conta): informe 1 dígito.');
  const valid=issues.length===0;
  return {valid,bank:'341',agency,agencyDv,account,accountDv,remittanceSegment:valid?agency+'00'+account+accountDv:'',issues};
}
export function bankCopyText(){
  const b=bankRegistration;
  return 'CADASTRO DO BANCO NO SISTEMA (ITAÚ)\nÚltima análise: '+source.reviewedOn+'\nCódigo: '+b.code+'\nBanco: '+b.name+'\nCarteira: '+b.wallet+'\nLayout Remessa: '+b.remittanceLayout+'\nMensagem para local de pagamento: '+b.paymentLocation+'\n\nReferência técnica do layout: '+source.edition+'\n'+source.url+'\nNão foi confirmada uma edição oficial pública mais recente.';
}
export function accountCopyText(config){
  const c=composeAccount(config);if(!c.valid)return '';
  return 'CADASTRO DA CONTA CORRENTE NO SISTEMA (ITAÚ)\nÚltima análise: '+source.reviewedOn+'\nAgência: '+c.agency+'\nDígito da agência: deixar vazio\nConta corrente: '+c.account+'\nDV da conta (DAC agência/conta): '+c.accountDv+'\n\nTRECHO NA REMESSA CNAB 400\nAgência (4) + zeros (2) + conta (5) + DAC (1): '+c.remittanceSegment+'\nHeader: 027–038. Detalhe tipo 1: 018–029.\nConferência de formato; o DAC não foi recalculado.';
}
