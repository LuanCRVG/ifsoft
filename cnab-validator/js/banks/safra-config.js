/** Interpretação do e-mail Safra para o cadastro desta integração Sistema. */
export const bankRegistration=Object.freeze({reviewedOn:'04/11/2026',code:'422',name:'BANCO SAFRA',remittanceLayout:'C400',acceptance:'Não',paymentLocation:'PAGÁVEL EM QUALQUER BANCO DO SISTEMA DE COMPENSAÇÃO'});
export const defaults=Object.freeze({agencyDv:'0',wallet:'1'});
export const emailExample=Object.freeze({shortname:'NOME DA EMPRESA',agency:'12345',agencyLabel:'12345 - Barra',accountWithDv:'001234567',printing:'EMISSÃO EMPRESA',serviceArea:'100% SAFRA',layout:'400',product:'COBRANÇA',wallet:'1'});
export const agencyDvExplanation='Na homologação do nosso Sistema com ACBrBoleto, o campo de dígito da agência vazio impediu gerar a remessa; preencher 0 permitiu a geração. Esse zero é um padrão do cadastro desta integração e não foi confirmado pelo Safra como DV oficial da agência.';
const walletMapping=Object.freeze({'1':'01'});
export function composeIdentification(config={}) {
  const issues=[],warnings=[];
  const agency=typeof config.agency==='string'?config.agency:'';
  const accountWithDv=typeof config.accountWithDv==='string'?config.accountWithDv:'';
  const agencyDv=config.agencyDv===undefined?defaults.agencyDv:(typeof config.agencyDv==='string'?config.agencyDv:'');
  const wallet=config.wallet===undefined?defaults.wallet:(typeof config.wallet==='string'?config.wallet:'');
  const agencyValid=/^\d{5}$/.test(agency), accountValid=/^\d{9}$/.test(accountWithDv);
  if(!agencyValid)issues.push('Agência: informe exatamente 5 dígitos, preservando os zeros à esquerda.');
  if(!accountValid)issues.push('Conta completa recebida do banco: informe exatamente 9 dígitos, incluindo o DV e preservando os zeros à esquerda.');
  if(!/^\d$/.test(agencyDv))issues.push('Dígito da agência no Sistema: informe 1 dígito. Nesta integração, o padrão é 0; esse campo não integra a identificação da remessa.');
  const walletERP=walletMapping[wallet]??null;
  if(!/^\d$/.test(wallet))issues.push('Carteira informada pelo banco: informe 1 dígito. O exemplo de homologação utiliza 1.');
  else if(!walletERP)warnings.push('O mapeamento da carteira '+wallet+' para o cadastro deste Sistema não está documentado neste módulo. Confirme-o antes de copiar o cadastro.');
  const identificationValid=agencyValid&&accountValid;
  const identification=identificationValid?agency+accountWithDv:'';
  return {valid:issues.length===0&&walletERP!==null,identificationValid,agency,agencyDv,accountWithDv,account:accountValid?accountWithDv.slice(0,8):'',accountDv:accountValid?accountWithDv.slice(8):'',identification,beneficiary:identification,wallet,walletERP,bank:'422',bankName:'Banco Safra',layout:'400',issues,warnings,notes:[agencyDvExplanation,'A separação da conta e a composição de 14 posições são estruturais: não calculam o DV, não consultam o banco e não confirmam titularidade.']};
}
