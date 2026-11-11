/** Santander H7800 V2.38, manual entregue pelo banco em outubro/2026. */
export const source=Object.freeze({edition:'H7800 · V2.38 · Outubro/2026',reviewedOn:'11/11/2026',reviewedISO:'2026-11-11',fileName:'H7800_Layout_de_Cobranca_353_400_posicoes_V_2_38_Out_2026_Portugues.pdf'});
export const wallets=Object.freeze({'1':'Eletrônica com Registro · emissão pelo banco','3':'Caucionada · Eletrônica com Registro','5':'Rápida com Registro · emissão pelo Sistema','6':'Caucionada · Rápida com Registro','7':'Descontada · Eletrônica com Registro','8':'Cessão · contratação SX Integra'});
export const bankRegistration=Object.freeze({code:'033',name:'BANCO SANTANDER',remittanceLayout:'C400',walletSystem:'101',modality:'101',wallet:'5',paymentLocation:'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO'});
export const accountExample=Object.freeze({agency:'1234',agencyDv:'0',agreement:'0123456',account:'01234567',accountDv:'8',transmission:'12340012345600123456',complement:'78'});
export function composeAccount(config={}){
  const value=name=>typeof config[name]==='string'?config[name]:'';
  const agency=value('agency'),agencyDv=value('agencyDv'),agreement=value('agreement'),account=value('account'),accountDv=value('accountDv'),accountWithDv=account+accountDv,transmission=value('transmission'),complement=value('complement'),wallet='5';
  const issues=[];
  if(!/^\d{4}$/.test(agency))issues.push('Agência: informe 4 dígitos, preservando os zeros.');
  if(agencyDv&&!/^\d$/.test(agencyDv))issues.push('Dígito da agência: deixe vazio se não informado pelo banco, ou preencha 1 dígito.');
  if(!/^\d{7}$/.test(agreement))issues.push('Convênio/cedente: informe os 7 dígitos da parametrização recebida do Santander.');
  if(!/^\d{8}$/.test(account))issues.push('Conta corrente: informe 8 dígitos, sem o DV.');
  if(!/^\d$/.test(accountDv))issues.push('DV da conta: informe 1 dígito.');
  if(!/^\d{20}$/.test(transmission))issues.push('Código de transmissão C400: copie as 20 posições fornecidas pelo banco. Não use o código C240.');
  if(!wallets[wallet])issues.push('Selecione a carteira contratada.');
  const extended=/^\d{9}$/.test(accountWithDv),normalizedAccount=extended?accountWithDv.padStart(10,'0'):accountWithDv;
  if(extended){if(!/^\d{2}$/.test(complement))issues.push('Complemento 400: informe as 2 posições fornecidas pelo banco.');else if(complement!==normalizedAccount.slice(8))issues.push('O complemento 400 deve corresponder às 2 últimas posições da conta normalizada para 10 posições.');}
  else if(complement)issues.push('Na conta de 8 posições, o identificador e o complemento ficam em branco (nota 2).');
  // The transmission code is bank-issued. Do not manufacture it from a universal formula.
  const valid=issues.length===0;
  return {valid,bank:'033',agency,agencyDv,agreement,accountWithDv,account,accountDv,normalizedAccount,transmission,complement,identifier:extended?'I':' ',wallet,issues};
}
export function accountCopyText(config){const c=composeAccount(config);if(!c.valid)return '';return 'SANTANDER · CADASTRO NO SISTEMA\nÚltima análise: '+source.reviewedOn+'\nBanco: 033 · BANCO SANTANDER\nLayout: C400\nCarteira: '+c.wallet+' · '+wallets[c.wallet]+'\nAgência: '+c.agency+'\nDígito da agência: '+(c.agencyDv||'não informado pelo banco')+'\nConvênio/cedente: '+c.agreement+'\nConta: '+c.account+'\nDígito da conta: '+c.accountDv+'\nCódigo de transmissão C400: '+c.transmission+'\nComplemento 400: '+(c.complement||'branco')+'\n\nREMESSA CNAB 400\nHeader 027–046: '+c.transmission+'\nConta cobrança normalizada: '+c.normalizedAccount+'\nIdentificador 383: '+(c.identifier.trim()||'branco')+'\nComplemento 384–385: '+(c.complement||'brancos')+'\nO código de transmissão é fornecido pelo banco. Confira a correspondência dos campos com a parametrização do seu convênio.';}
