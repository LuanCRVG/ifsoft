/** Santander H7800 V2.38, manual entregue pelo banco em outubro/2026. */
export const source=Object.freeze({edition:'H7800 · V2.38 · Outubro/2026',reviewedOn:'11/11/2026',reviewedISO:'2026-11-11',fileName:'H7800_Layout_de_Cobranca_353_400_posicoes_V_2_38_Out_2026_Portugues.pdf'});
export const wallets=Object.freeze({'1':'Eletrônica com Registro · emissão pelo banco','3':'Caucionada · Eletrônica com Registro','5':'Rápida com Registro · emissão pelo Sistema','6':'Caucionada · Rápida com Registro','7':'Descontada · Eletrônica com Registro','8':'Cessão · contratação SX Integra'});
export const bankRegistration=Object.freeze({code:'033',name:'BANCO SANTANDER',remittanceLayout:'C400',walletSystem:'101',modality:'101',wallet:'5',paymentLocation:'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO'});
export const defaults=Object.freeze({agencyDv:'0'});
export const accountExample=Object.freeze({agency:'1234',agencyDv:'0',agreement:'0123456',account:'01234567',accountDv:'8',transmission:'12340012345600123456'});
export function composeAccount(config={}){
  const value=name=>typeof config[name]==='string'?config[name]:'';
  const agency=value('agency'),agencyDv=value('agencyDv'),agreement=value('agreement'),account=value('account'),accountDv=value('accountDv'),accountWithDv=account+accountDv,transmission=value('transmission'),wallet='5';
  const issues=[];
  if(!/^\d{4}$/.test(agency))issues.push('Agência: informe 4 dígitos, preservando os zeros.');
  if(!/^\d$/.test(agencyDv))issues.push('Dígito da agência: preencha 0 no cadastro desta integração no Sistema.');
  if(!/^\d{7}$/.test(agreement))issues.push('Código cedente: informe os 7 dígitos recebidos do Santander. O campo Convênio do banco permanece vazio.');
  if(!/^\d{8}$/.test(account))issues.push('Conta corrente: informe 8 dígitos, sem o DV.');
  if(!/^\d$/.test(accountDv))issues.push('DV da conta: informe 1 dígito.');
  if(!/^\d{20}$/.test(transmission))issues.push('Código de transmissão C400: copie as 20 posições fornecidas pelo banco. Não use o código C240.');
  if(!wallets[wallet])issues.push('Selecione a carteira contratada.');
  const extended=/^\d{9}$/.test(accountWithDv),normalizedAccount=extended?accountWithDv.padStart(10,'0'):accountWithDv;
  // This technical remittance field is not a System registration input.
  const complement=extended?normalizedAccount.slice(8):'';
  // The transmission code is bank-issued. Do not manufacture it from a universal formula.
  const valid=issues.length===0;
  return {valid,bank:'033',agency,agencyDv,agreement,bankAgreement:'',accountWithDv,account,accountDv,normalizedAccount,transmission,complement,identifier:extended?'I':' ',wallet,issues};
}
export function accountCopyText(config){const c=composeAccount(config);if(!c.valid)return '';return 'SANTANDER · CADASTRO NO SISTEMA\nÚltima análise: '+source.reviewedOn+'\nBanco: 033 · BANCO SANTANDER\nLayout: C400\nCarteira no Sistema: '+bankRegistration.walletSystem+'\nCódigo da Modalidade: '+bankRegistration.modality+'\nAgência: '+c.agency+'\nDígito da agência: '+c.agencyDv+'\nO banco informou a agência com 4 dígitos. Nesta integração, preencha o dígito da agência com 0 no Sistema; isso não confirma um DV oficial informado pelo banco.\nCódigo cedente: '+c.agreement+'\nConvênio do banco: deixar em branco\nConta: '+c.account+'\nDígito da conta: '+c.accountDv+'\nCódigo de transmissão C400: '+c.transmission+'\n\nDADOS TÉCNICOS DA REMESSA CNAB 400\nHeader 027–046: '+c.transmission+'\nConta cobrança normalizada: '+c.normalizedAccount+'\nIdentificador 383: '+(c.identifier.trim()||'branco')+'\nComplemento 384–385: '+(c.complement||'brancos')+'\nO complemento é calculado da conta para a remessa; não existe um campo Complemento 400 a preencher no Sistema.\nO código de transmissão é fornecido pelo banco e não recebe novamente o DV da agência.';}
