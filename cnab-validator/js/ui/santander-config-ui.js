import {bankRegistration,source,composeAccount,accountExample,accountCopyText} from '../banks/santander-config.js';
export function setupSantanderConfiguration(notify,onChange){
  const $=id=>document.getElementById(id),form=$('santanderConfigForm'),read=()=>Object.fromEntries(new FormData(form));
  function update(showIssues=false){
    const c=composeAccount(read());$('santanderCopyAccount').disabled=!c.valid;$('santanderAccountResult').hidden=!c.valid;$('santanderAccountEmpty').hidden=c.valid;
    for(const [id,key] of [['santanderResultAgency','agency'],['santanderResultAgencyDv','agencyDv'],['santanderResultAccount','account'],['santanderResultAccountDv','accountDv'],['santanderResultCedente','agreement'],['santanderTransmissionResult','transmission'],['santanderNormalizedAccount','normalizedAccount'],['santanderComplementResult','complement']])$(id).textContent=c.valid?(c[key]||'Não informado pelo banco'):'';
    $('santanderConfigIssues').replaceChildren();if(showIssues)for(const issue of c.issues){const li=document.createElement('li');li.textContent=issue;$('santanderConfigIssues').append(li);}$('santanderConfigIssues').hidden=!showIssues||c.valid;
  }
  async function copy(text){try{await navigator.clipboard.writeText(text);notify('Cadastro Santander copiado.');}catch{notify('Cópia indisponível. Selecione os valores na tela.');}}
  form.addEventListener('submit',event=>{event.preventDefault();update(true);});form.addEventListener('input',()=>{update(true);onChange?.();});
  $('santanderCopyBank').addEventListener('click',()=>copy('CADASTRO DO BANCO NO SISTEMA · SANTANDER\nÚltima análise: '+source.reviewedOn+'\nCódigo: 033\nBanco: BANCO SANTANDER\nCarteira no Sistema: 101\nModalidade no Sistema: 101\nTipo de cobrança na remessa: 5\nLayout Remessa: C400\nMensagem para local de pagamento: '+bankRegistration.paymentLocation+'\nCarteira/modalidade 101: configuração informada do Sistema. Tipo 5: cobrança rápida com registro, emissão pelo beneficiário.'));
  $('santanderCopyAccount').addEventListener('click',()=>copy(accountCopyText(read())+'\nConvênio do banco no Sistema: deixar em branco\nCódigo da Modalidade no Sistema: 101\nCarteira no Sistema: 101\nTipo de cobrança na remessa: 5'));
  $('santanderUseExample').addEventListener('click',()=>{for(const [name,value] of Object.entries(accountExample))form.elements.namedItem(name).value=value;update(true);onChange?.();notify('Exemplo Santander exclusivamente fictício preenchido.');});
  function reset(){form.reset();update(false);}reset();return {reset,getConfiguration:()=>composeAccount(read())};
}
